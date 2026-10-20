// A small Markdown renderer for the changelogs: headings, lists (one level of nesting),
// paragraphs, fenced code, inline code, bold, italics and links.

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text: string) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
      const external = /^https?:/.test(href);
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${target}>${label}</a>`;
    });
}

export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let paragraph: string[] = [];
  const list: { indent: number; items: string[] }[] = [];

  const flushParagraph = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    while (list.length) closeList();
  };
  const closeList = () => {
    const level = list.pop()!;
    const html = `<ul>${level.items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    if (list.length) list[list.length - 1].items[list[list.length - 1].items.length - 1] += html;
    else out.push(html);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flushParagraph();
      flushList();
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) code.push(lines[i]);
      out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const text = heading[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }
    const item = /^(\s*)[-*]\s+(.*)$/.exec(line);
    if (item) {
      flushParagraph();
      const indent = item[1].length;
      while (list.length && indent < list[list.length - 1].indent) closeList();
      if (!list.length || indent > list[list.length - 1].indent) list.push({ indent, items: [] });
      list[list.length - 1].items.push(inline(item[2]));
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      if (!(lines[i + 1] ?? '').match(/^\s*[-*]\s/)) flushList();
      continue;
    }
    if (list.length && /^\s+\S/.test(line)) {
      const current = list[list.length - 1];
      current.items[current.items.length - 1] += ` ${inline(line.trim())}`;
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return out.join('\n');
}
