import { useState } from 'react';
import { Check, Copy } from './icons';

/** Copies `text` to the clipboard and shows a tick for a moment. */
export function CopyButton({ text, label = 'Copy', className = 'copy-btn' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      aria-label={copied ? 'Copied' : label}
      data-copied={copied ? '' : undefined}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* Clipboard blocked: nothing to do. */
        }
      }}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}
