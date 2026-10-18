import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Reads the component API straight from the TypeScript source of `src/index.ts`, so the
// manifest and the llms files can't drift from the code: nothing here is written by hand.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const entryPath = path.join(srcDir, 'index.ts');

export const PACKAGE_NAME = 'pada-ds';

// Calls whose first argument is the component's render function.
const COMPONENT_WRAPPERS = new Set(['forwardRef', 'React.forwardRef', 'memo', 'React.memo']);

const collapse = (text) => text.replace(/\s+/g, ' ').trim();

export function createEntryProgram() {
  const program = ts.createProgram([entryPath], {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    allowImportingTsExtensions: true,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  });
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(entryPath);
  if (!entry) {
    throw new Error(`Cannot read the package entry ${entryPath}`);
  }
  const moduleSymbol = checker.getSymbolAtLocation(entry);
  if (!moduleSymbol) {
    throw new Error(`${entryPath} has no exports`);
  }
  return { program, checker, exports: checker.getExportsOfModule(moduleSymbol) };
}

export function resolveExport(checker, symbol) {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

const unwrap = (node) => {
  let current = node;
  while (current && (ts.isParenthesizedExpression(current) || ts.isAsExpression(current))) {
    current = current.expression;
  }
  return current;
};

// The render function of a component initializer, or undefined if it isn't one.
function componentFunction(expression) {
  const node = unwrap(expression);
  if (!node) return undefined;
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return node;
  if (ts.isCallExpression(node) && COMPONENT_WRAPPERS.has(node.expression.getText())) {
    return componentFunction(node.arguments[0]);
  }
  return undefined;
}

function renderFunction(declaration) {
  if (ts.isFunctionDeclaration(declaration)) return declaration;
  if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
    return componentFunction(declaration.initializer);
  }
  return undefined;
}

function propsTypeNode(declaration, fn) {
  // `const X: React.FC<XProps> = ...`
  if (ts.isVariableDeclaration(declaration) && declaration.type) {
    if (ts.isTypeReferenceNode(declaration.type) && declaration.type.typeArguments?.length) {
      return declaration.type.typeArguments[0];
    }
  }
  // `React.forwardRef<Element, XProps>(...)`
  if (ts.isVariableDeclaration(declaration)) {
    const init = unwrap(declaration.initializer);
    if (init && ts.isCallExpression(init) && init.typeArguments?.length === 2) {
      return init.typeArguments[1];
    }
  }
  // `({ ... }: XProps) => ...`
  return fn.parameters[0]?.type;
}

// Some comments spell characters as `\uXXXX` escapes; comments aren't string literals, so
// TypeScript keeps them as typed. Decode them so readers see the character.
const decodeEscapes = (text) =>
  text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

function docText(node) {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
  const last = docs[docs.length - 1];
  return last ? collapse(decodeEscapes(ts.getTextOfJSDocComment(last.comment) ?? '')) : '';
}

function destructuredDefaults(fn) {
  const defaults = new Map();
  const param = fn.parameters[0];
  if (!param || !ts.isObjectBindingPattern(param.name)) return defaults;
  for (const element of param.name.elements) {
    if (element.dotDotDotToken || !element.initializer) continue;
    const key = (element.propertyName ?? element.name).getText();
    defaults.set(key, collapse(element.initializer.getText()));
  }
  return defaults;
}

function memberName(name) {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : name.getText();
}

function isLocal(declaration) {
  const file = declaration.getSourceFile();
  return !file.isDeclarationFile && path.resolve(file.fileName).startsWith(srcDir + path.sep);
}

// An interface or type alias declared in `src/`, or undefined for library types.
function localTypeDeclaration(checker, nameNode) {
  const symbol = checker.getSymbolAtLocation(nameNode);
  if (!symbol) return undefined;
  const target = resolveExport(checker, symbol);
  const declaration = target.declarations?.find(
    (d) => ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d),
  );
  return declaration && isLocal(declaration) ? declaration : undefined;
}

function collectProps(checker, typeNode, componentName) {
  const props = new Map();
  const inherited = [];

  const addMembers = (members) => {
    for (const member of members) {
      if (!ts.isPropertySignature(member) || !member.type) {
        throw new Error(`${componentName}: unsupported props member \`${collapse(member.getText())}\``);
      }
      const name = memberName(member.name);
      if (props.has(name)) continue;
      props.set(name, {
        name,
        type: collapse(member.type.getText()),
        required: !member.questionToken,
        description: docText(member),
      });
    }
  };

  const visitDeclaration = (declaration) => {
    if (ts.isTypeAliasDeclaration(declaration)) {
      visit(declaration.type);
      return;
    }
    addMembers(declaration.members);
    for (const clause of declaration.heritageClauses ?? []) {
      for (const base of clause.types) {
        if (expandUtility(base.expression.getText(), base.typeArguments)) continue;
        const local = base.typeArguments ? undefined : localTypeDeclaration(checker, base.expression);
        if (local) visitDeclaration(local);
        else inherited.push(collapse(base.getText()));
      }
    }
  };

  const literalKeys = (node) =>
    (ts.isUnionTypeNode(node) ? node.types : [node])
      .filter((type) => ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal))
      .map((type) => type.literal.text);

  // Omit<LocalProps, 'a' | 'b'> and Pick<LocalProps, 'a'>: expand the local type, then filter.
  // Returns false for anything else so the caller falls back to listing it as inherited.
  const expandUtility = (utility, typeArguments) => {
    if ((utility !== 'Omit' && utility !== 'Pick') || typeArguments?.length !== 2) return false;
    const inner = collectProps(checker, typeArguments[0], componentName);
    const keys = new Set(literalKeys(typeArguments[1]));
    const keep = (name) => (utility === 'Omit' ? !keys.has(name) : keys.has(name));
    for (const prop of inner.props) if (keep(prop.name) && !props.has(prop.name)) props.set(prop.name, prop);
    if (utility === 'Omit') {
      inherited.push(...inner.inherited.map((base) => `Omit<${base}, ${collapse(typeArguments[1].getText())}>`));
    }
    return true;
  };

  const visit = (node) => {
    if (ts.isTypeReferenceNode(node) && expandUtility(node.typeName.getText(), node.typeArguments)) return;
    if (ts.isParenthesizedTypeNode(node)) {
      visit(node.type);
    } else if (ts.isTypeLiteralNode(node)) {
      addMembers(node.members);
    } else if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
      // A union of prop shapes (single vs multiple selection, say) lists every prop once.
      node.types.forEach(visit);
    } else {
      const local =
        ts.isTypeReferenceNode(node) && !node.typeArguments
          ? localTypeDeclaration(checker, node.typeName)
          : undefined;
      if (local) visitDeclaration(local);
      else inherited.push(collapse(node.getText()));
    }
  };

  if (typeNode) visit(typeNode);
  return { props: [...props.values()], inherited: [...new Set(inherited)] };
}

function propsTypeName(typeNode) {
  return typeNode && ts.isTypeReferenceNode(typeNode) && !typeNode.typeArguments
    ? typeNode.typeName.getText()
    : null;
}

function componentEntry(checker, name, exportName, declaration) {
  const fn = renderFunction(declaration);
  if (!fn) return undefined;
  const typeNode = propsTypeNode(declaration, fn);
  const { props, inherited } = collectProps(checker, typeNode, name);
  const defaults = destructuredDefaults(fn);
  const docHost = ts.isVariableDeclaration(declaration) ? declaration.parent.parent : declaration;
  return {
    name,
    importPath: PACKAGE_NAME,
    import: `import { ${exportName} } from '${PACKAGE_NAME}';`,
    source: path.relative(rootDir, declaration.getSourceFile().fileName).split(path.sep).join('/'),
    description: docText(docHost),
    propsType: propsTypeName(typeNode),
    extends: inherited,
    props: props.map((prop) => ({
      name: prop.name,
      type: prop.type,
      required: prop.required,
      default: defaults.get(prop.name) ?? null,
      description: prop.description,
    })),
  };
}

// The function a compound part points at: `Root: DialogRoot` in an object literal, or
// `Popover.Root = PopoverRoot` assigned onto a component function.
function partDeclaration(checker, propertySymbol) {
  const declaration = propertySymbol.valueDeclaration;
  if (!declaration) return undefined;
  let valueSymbol;
  if (ts.isPropertyAssignment(declaration)) {
    valueSymbol = checker.getSymbolAtLocation(declaration.initializer);
  } else if (ts.isShorthandPropertyAssignment(declaration)) {
    valueSymbol = checker.getShorthandAssignmentValueSymbol(declaration);
  } else if (ts.isPropertyAccessExpression(declaration) && ts.isBinaryExpression(declaration.parent)) {
    valueSymbol = checker.getSymbolAtLocation(declaration.parent.right);
  }
  return valueSymbol ? resolveExport(checker, valueSymbol).valueDeclaration : undefined;
}

// `export const Logo = BrandLogo;`: the declaration of the component an alias points at.
function aliasedDeclaration(checker, declaration) {
  if (!ts.isVariableDeclaration(declaration)) return undefined;
  const init = unwrap(declaration.initializer);
  if (!init || !ts.isIdentifier(init)) return undefined;
  const symbol = checker.getSymbolAtLocation(init);
  return symbol ? resolveExport(checker, symbol).valueDeclaration : undefined;
}

/**
 * Builds the manifest object for every component exported from `src/index.ts`, including the
 * parts of compound components (`Dialog.Content`, `Popover.Trigger`, …) as `Name.Part` entries.
 */
export function buildManifest() {
  const { checker, exports } = createEntryProgram();
  const components = [];

  for (const exported of exports) {
    const name = exported.getName();
    if (!/^[A-Z]/.test(name)) continue;
    const target = resolveExport(checker, exported);
    const declaration = target.valueDeclaration;
    if (!declaration) continue;

    let entry = componentEntry(checker, name, name, declaration);
    if (!entry) {
      // A renamed component kept under its old name: same props, its own (deprecation) note.
      const aliased = aliasedDeclaration(checker, declaration);
      entry = aliased && componentEntry(checker, name, name, aliased);
      const deprecated = ts.getJSDocTags(declaration).find((tag) => tag.tagName.text === 'deprecated');
      if (entry && deprecated) entry.description = `Deprecated: ${decodeEscapes(ts.getTextOfJSDocComment(deprecated.comment) ?? '')}`.trim();
    }
    if (entry) components.push(entry);

    const type = checker.getTypeOfSymbolAtLocation(target, declaration);
    for (const part of checker.getPropertiesOfType(type)) {
      if (!/^[A-Z]/.test(part.getName())) continue;
      const partDecl = partDeclaration(checker, part);
      const partEntry = partDecl && componentEntry(checker, `${name}.${part.getName()}`, name, partDecl);
      if (partEntry) components.push(partEntry);
    }
  }

  components.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return {
    name: PACKAGE_NAME,
    styles: {
      tokens: `${PACKAGE_NAME}/tokens.css`,
      components: `${PACKAGE_NAME}/styles.css`,
      base: `${PACKAGE_NAME}/base.css`,
    },
    components,
  };
}

function exampleValue(prop) {
  const type = prop.type;
  if (type.includes('=>')) return '{() => {}}';
  const literal = /^'([^']*)'(?:\s*\|\s*'[^']*')*$/.exec(type);
  if (literal) return `"${literal[1]}"`;
  if (type === 'string') return '"..."';
  if (type === 'number') return '{0}';
  if (type === 'boolean') return '{true}';
  if (type.endsWith('[]')) return '{[]}';
  if (type.includes('ReactElement')) return '{<span />}';
  if (type.includes('ReactNode')) return '"..."';
  return '{undefined}';
}

/** A minimal JSX usage that passes only the component's required props. */
export function usageExample(component) {
  const attributes = component.props
    .filter((prop) => prop.required && prop.name !== 'children')
    .map((prop) => `${prop.name}=${exampleValue(prop)}`);
  const opening = [component.name, ...attributes].join(' ');
  const children = component.props.find((prop) => prop.required && prop.name === 'children');
  if (!children) return `<${opening} />`;
  const inner = children.type.includes('ReactElement') ? '<span>...</span>' : '...';
  return `<${opening}>${inner}</${component.name}>`;
}

const INTRO = [
  '> Pada (`pada-ds`) is a React design system written in TypeScript: components, CSS design tokens, and light/dark theming. It needs `react` and `react-dom` 19 as peer dependencies.',
  '',
  '## Install',
  '',
  '```bash',
  `npm install ${PACKAGE_NAME}`,
  '```',
  '',
  '## Usage',
  '',
  'Import the tokens and the component styles once at the app root, then import components by name from the package root:',
  '',
  '```tsx',
  `import '${PACKAGE_NAME}/tokens.css';`,
  `import '${PACKAGE_NAME}/styles.css';`,
  `import { Button } from '${PACKAGE_NAME}';`,
  '',
  '<Button variant="primary">Save</Button>',
  '```',
  '',
  `- \`${PACKAGE_NAME}/tokens.css\`: design tokens (CSS custom properties, all prefixed \`--pada-\`) only.`,
  `- \`${PACKAGE_NAME}/tokens\`: token names as \`var()\` strings and breakpoints for JS (\`import { tokens, breakpoints } from '${PACKAGE_NAME}/tokens'\`); \`${PACKAGE_NAME}/tokens.scss\` and \`${PACKAGE_NAME}/tokens.json\` carry the same tokens for Sass and design tools.`,
  `- \`${PACKAGE_NAME}/styles.css\`: styles for every component.`,
  `- \`${PACKAGE_NAME}/headless\`: unstyled, accessible parts with no CSS (\`Dialog\`, \`Popover\`, \`Tooltip\`, \`DropdownMenu\`, plus \`Slot\`, \`Portal\`, \`VisuallyHidden\` and hooks). Compose them as \`<Dialog.Root><Dialog.Trigger/><Dialog.Portal><Dialog.Overlay/><Dialog.Content><Dialog.Title/></Dialog.Content></Dialog.Portal></Dialog.Root>\`; style them through \`data-state\`, \`data-side\` and \`aria-*\` attributes; \`asChild\` merges a part onto your own element.`,
  `- \`${PACKAGE_NAME}/base.css\` (optional): document base styles (\`body\` background, color and font; zero \`p\` margins).`,
  `- \`${PACKAGE_NAME}/manifest.json\`: machine-readable component API (props, types, defaults, descriptions).`,
  '',
  '## Theming',
  '',
  'By default the theme follows the operating system (`prefers-color-scheme`). Set `data-theme="light"` or `data-theme="dark"` on `<html>` or on any container to force a theme for that subtree. Remove the attribute to follow the OS again.',
  '',
  'More theme axes work the same way and combine freely: `data-accent` (a palette hue such as `indigo`, `amber`, `emerald`, or `custom` with `--pada-accent-hue`), `data-neutral` (`stone`, `slate`, `gray`, `zinc`, `neutral`), `data-density` (`compact`, `comfortable`, `spacious`), `data-radius` (`none`, `sm`, `md`, `lg`, `xl`), `data-motion` (`reduced`, `full`) and `data-contrast` (`standard`, `more`).',
  '',
  'Style custom UI with semantic tokens rather than raw colours: `--pada-color-surface`, `--pada-color-fg`, `--pada-color-fg-muted`, `--pada-color-border`, and per intent (`accent`, `neutral`, `success`, `warning`, `danger`, `info`) `--pada-color-<intent>-solid`, `-solid-hover`, `-on-solid`, `-subtle`, `-fg`, `-border`. Spacing is `--pada-space-<n>` (n × 0.25rem × density), radius `--pada-radius-xs` to `-3xl`, motion `--pada-duration-fast|normal|slow` with `--pada-ease-standard|enter|exit|emphasized`, layers `--pada-z-dropdown|modal|popover|toast|tooltip`.',
];

/** The short index: what Pada is, how to install and import it, and one line per component. */
export function renderLlmsTxt(manifest) {
  const lines = [
    '# Pada Design System',
    '',
    ...INTRO,
    '',
    '## Components',
    '',
    `Every component is a named export: \`import { Name } from '${PACKAGE_NAME}'\`. Props marked \`?\` are optional. Full prop tables with types, defaults and examples are in llms-full.txt.`,
    '',
  ];
  for (const component of manifest.components) {
    const props = component.props.map((prop) => `${prop.name}${prop.required ? '' : '?'}`).join(', ');
    const inherited = component.extends.length ? `; extends ${component.extends.join(', ')}` : '';
    lines.push(`- ${component.name}: ${props || 'no props'}${inherited}`);
  }
  return `${lines.join('\n')}\n`;
}

const cell = (text) => text.replace(/\|/g, '\\|');

/** The full reference: llms.txt's introduction plus a prop table and an example per component. */
export function renderLlmsFullTxt(manifest) {
  const lines = ['# Pada Design System: full component reference', '', ...INTRO, '', '## Components', ''];
  for (const component of manifest.components) {
    lines.push(`### ${component.name}`, '', `\`${component.import}\``, '');
    if (component.description) {
      lines.push(component.description, '');
    }
    if (component.props.length) {
      lines.push('| Prop | Type | Required | Default | Description |', '| --- | --- | --- | --- | --- |');
      for (const prop of component.props) {
        const defaultValue = prop.default === null ? '-' : `\`${cell(prop.default)}\``;
        lines.push(
          `| ${prop.name} | \`${cell(prop.type)}\` | ${prop.required ? 'yes' : 'no'} | ${defaultValue} | ${cell(prop.description) || '-'} |`,
        );
      }
      lines.push('');
    } else {
      lines.push('No props.', '');
    }
    if (component.extends.length) {
      lines.push(`Also accepts the props of ${component.extends.map((type) => `\`${type}\``).join(', ')}.`, '');
    }
    lines.push('```tsx', component.import, '', usageExample(component), '```', '');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}
