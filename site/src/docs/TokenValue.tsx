import { useEffect, useRef, useState } from 'react';

/** Shows the value a custom property resolves to right now (it updates with the theme). */
export function TokenValue({ name, as = 'raw' }: { name: string; as?: 'raw' | 'color' | 'length' }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      if (as === 'raw') return setValue(getComputedStyle(el).getPropertyValue(name).trim());
      const property = as === 'color' ? 'color' : 'width';
      el.style.setProperty(property, `var(${name})`);
      setValue(getComputedStyle(el).getPropertyValue(property));
      el.style.removeProperty(property);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent', 'data-density', 'data-radius', 'data-neutral'] });
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', read);
    return () => {
      observer.disconnect();
      scheme.removeEventListener('change', read);
    };
  }, [name, as]);
  return (
    <span ref={ref} className="token-value">
      {value}
    </span>
  );
}
