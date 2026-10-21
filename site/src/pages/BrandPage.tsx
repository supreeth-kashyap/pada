import { PadaLogo } from 'pada-ds';
import { asset } from '../lib/paths';
import { useReveal } from '../lib/useReveal';

const VARIANTS = [
  { variant: 'lockup', label: 'Lockup', note: 'The default. Use it wherever there is room.' },
  { variant: 'mark', label: 'Mark', note: 'Favicons, avatars and collapsed navigation.' },
  { variant: 'wordmark', label: 'Wordmark', note: 'When the mark already appears nearby.' },
] as const;

export function BrandPage() {
  useReveal();
  return (
    <main id="main" className="page">
      <div className="wrap">
        <header className="page-head" data-reveal>
          <p className="eyebrow">Brand</p>
          <h1 className="h2">
            Two soles, <span className="serif">one footing.</span>
          </h1>
          <p className="lede">
            The Pada mark is two mirrored halves, amber and accent, wide at the top and tapering to a point: two soles
            side by side, seen from above. पाद (pāda) is Sanskrit for foot, the part that carries the weight.
          </p>
        </header>
        <div className="brand-grid">
          {VARIANTS.map((item) => (
            <figure key={item.variant} className="brand-tile" data-reveal>
              <div className="brand-art">
                <PadaLogo variant={item.variant} size="xl" title={`Pada ${item.label.toLowerCase()}`} />
              </div>
              <figcaption>
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </figcaption>
            </figure>
          ))}
          <figure className="brand-tile brand-dark" data-reveal data-theme="dark">
            <div className="brand-art">
              <PadaLogo size="xl" tone="mono" title="Pada lockup in mono" />
            </div>
            <figcaption>
              <strong>Mono</strong>
              <span>On photos and busy backgrounds.</span>
            </figcaption>
          </figure>
        </div>
        <section className="prose brand-rules" data-reveal>
          <h2>Using the logo</h2>
          <ul>
            <li>Use the <code>PadaLogo</code> component (React) or <code>ds-pada-logo</code> (Angular); it draws the mark as inline SVG.</li>
            <li>The accent tone follows the theme's accent colour; the colour tone keeps the original amber and indigo.</li>
            <li>Keep clear space around the mark of at least half its height. Don't redraw, rotate, stretch or recolour it.</li>
          </ul>
          <p>
            <a href={asset('pada-logo.svg')} download>Download the SVG logo</a>
          </p>
        </section>
      </div>
    </main>
  );
}
