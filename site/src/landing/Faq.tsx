import { Accordion } from 'pada-ds';
import { links } from '../lib/docs';

const FAQ: { q: string; a: React.ReactNode }[] = [
  { q: 'Is Pada free to use?', a: <>Yes. Both packages are MIT licensed, for personal and commercial work.</> },
  {
    q: 'Which frameworks and versions does it support?',
    a: <>React 19 with <code>pada-ds</code>, and Angular 21 (with the CDK) with <code>pada-ds-angular</code>. Both are released together under one version number.</>,
  },
  {
    q: 'Which browsers?',
    a: <>The tokens use <code>light-dark()</code>, <code>color-mix()</code> and relative colours, so Pada needs a 2024-era browser: Chrome 123, Safari 18, Firefox 128 or later.</>,
  },
  {
    q: 'Can I use my own styles?',
    a: <>Yes. Restyle through component tokens (<code>--pada-button-*</code>), theme attributes, or skip the styled layer and use the headless parts with your own CSS. State is exposed as <code>data-*</code> and <code>aria-*</code> attributes.</>,
  },
  {
    q: 'Does it work with server rendering?',
    a: <>Yes. This website is prerendered with <code>pada-ds</code>, and the Angular library supports server rendering.</>,
  },
  {
    q: 'Is there a Figma library?',
    a: (
      <>
        Yes, free in the{' '}
        <a href={links.figma} target="_blank" rel="noopener noreferrer">Figma Community</a>, with variables that map to the tokens in code.
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="h2">
            Questions, <span className="serif">answered.</span>
          </h2>
        </div>
        <div data-reveal>
          <Accordion.Root type="single" collapsible defaultValue="0">
            {FAQ.map((item, i) => (
              <Accordion.Item key={item.q} value={String(i)}>
                <Accordion.Trigger>{item.q}</Accordion.Trigger>
                <Accordion.Content>{item.a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
