import { Link as RouterLink } from 'react-router-dom';
import { asset, ROUTES } from '../lib/paths';
import { ArrowRight } from '../shell/icons';

/** Short screen recordings of components in use (made by site/scripts/capture-media.mjs). */
const REEL = [
  { file: 'theme', title: 'Seven attributes, one re-theme', slug: 'theme-provider' },
  { file: 'dialog', title: 'Dialog motion and focus', slug: 'dialog' },
  { file: 'command-palette', title: 'Command palette', slug: 'command-palette' },
  { file: 'date-range-picker', title: 'Date range picker', slug: 'date-range-picker' },
  { file: 'toaster', title: 'Toasts that stack', slug: 'toaster' },
  { file: 'data-table', title: 'Sort, select and page', slug: 'data-table' },
];

export function MotionReel() {
  return (
    <section className="section reel" aria-labelledby="reel-title">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <p className="eyebrow">In motion</p>
          <h2 id="reel-title" className="h2">
            Motion with <span className="serif">footing.</span>
          </h2>
          <p className="lede">
            Quick, settled transitions built on duration and easing tokens. Under reduced motion they are replaced
            with instant changes.
          </p>
        </div>
        <ul className="reel-grid">
          {REEL.map((item, i) => (
            <li key={item.file} className="reel-item" data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 0.06}s` }}>
              <video
                src={asset(`media/${item.file}.mp4`)}
                poster={asset(`media/${item.file}.jpg`)}
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                aria-label={`Screen recording: ${item.title}`}
              />
              <div className="reel-caption">
                <span>{item.title}</span>
                <RouterLink to={ROUTES.component(item.slug)} aria-label={`${item.title}: docs`}>
                  <ArrowRight size={14} />
                </RouterLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
