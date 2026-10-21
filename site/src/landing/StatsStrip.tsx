import type { ReactNode } from 'react';
import { currentComponents, docs } from '../lib/docs';
import { AngularLogo, Box, Grid, Palette, ReactLogo, Sliders } from '../shell/icons';

const SWATCHES = ['indigo', 'rose', 'amber', 'emerald', 'sky', 'violet'] as const;

interface StatItem {
  value: string;
  label: string;
  icon: ReactNode;
  /** A small visual beside the number. */
  art?: ReactNode;
}

export function StatsStrip() {
  const stats: StatItem[] = [
    { value: String(currentComponents.length), label: 'components', icon: <Box size={18} /> },
    {
      value: '2',
      label: 'frameworks, one API',
      icon: <ReactLogo size={18} className="brand-react" />,
      art: <AngularLogo size={18} className="brand-angular" />,
    },
    { value: '7', label: 'theme attributes', icon: <Sliders size={18} /> },
    {
      value: '22',
      label: 'accent palettes',
      icon: <Palette size={18} />,
      art: (
        <span className="stat-swatches">
          {SWATCHES.map((accent) => (
            <i key={accent} data-accent={accent} />
          ))}
        </span>
      ),
    },
    { value: String(docs.categories.length - 1), label: 'categories', icon: <Grid size={18} /> },
  ];
  return (
    <section className="stats-strip" aria-label="Pada in numbers">
      <div className="wrap">
        <ul>
          {stats.map((stat, i) => (
            <li key={stat.label} data-reveal style={{ ['--reveal-delay' as string]: `${i * 0.05}s` }}>
              <span className="stat-head" aria-hidden="true">
                <span className="stat-icon">{stat.icon}</span>
                {stat.art}
              </span>
              <strong>{stat.value}</strong>
              <span className="stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
