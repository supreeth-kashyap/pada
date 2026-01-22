import React, { useMemo, useState } from 'react';
import './CodeSnippet.css';
import { Button } from '../Button';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-python';

export type CodeSnippetType = 'micro' | 'single-line' | 'multi-line';

export interface CodeSnippetProps {
  code: string;
  language: string;
  type?: CodeSnippetType;
  label?: string;
  showCopy?: boolean;
  className?: string;
}

const normalizeLanguage = (language: string) => {
  const lang = language.toLowerCase();
  if (lang === 'sh' || lang === 'shell') return 'bash';
  if (lang === 'js') return 'javascript';
  if (lang === 'ts') return 'typescript';
  if (lang === 'py') return 'python';
  if (lang === 'yml') return 'yaml';
  return lang;
};

const highlightCode = (code: string, language: string): string => {
  const normalized = normalizeLanguage(language);
  const grammar = Prism.languages[normalized];
  if (!grammar) {
    return Prism.util.encode(code) as unknown as string;
  }
  return Prism.highlight(code, grammar, normalized);
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language,
  type = 'multi-line',
  label,
  showCopy = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(() => highlightCode(code, language), [code, language]);
  const displayLabel = label ?? `${language} code`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className={`code-snippet code-snippet--${type} ${className}`.trim()}>
      <div className="code-snippet__header">
        <span className="code-snippet__label">{displayLabel}</span>
        {showCopy && (
          <Button size="sm" variant="secondary" leftIcon="copy" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
      </div>
      <pre className="code-snippet__body" aria-label={`${language} code`}>
        <code
          className="code-snippet__code"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
};
