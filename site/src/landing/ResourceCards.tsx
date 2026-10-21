import type { ReactNode } from 'react';
import { links } from '../lib/docs';
import { AngularLogo, ExternalArrow, FigmaLogo, Github, ReactLogo, Storybook } from '../shell/icons';

interface Resource {
  href: string;
  title: string;
  meta: string;
  icon: ReactNode;
  /** The framework badge on the icon, if the destination is per framework. */
  badge?: ReactNode;
  featured?: boolean;
}

const RESOURCES: Resource[] = [
  {
    href: links.figma,
    title: 'Figma kit',
    meta: 'Community file',
    icon: <FigmaLogo size={22} />,
    featured: true,
  },
  {
    href: links.reactStorybook,
    title: 'Storybook',
    meta: 'React',
    icon: <Storybook size={20} className="brand-storybook" />,
    badge: <ReactLogo size={12} className="brand-react" />,
  },
  {
    href: links.angularStorybook,
    title: 'Storybook',
    meta: 'Angular',
    icon: <Storybook size={20} className="brand-storybook" />,
    badge: <AngularLogo size={12} className="brand-angular" />,
  },
  {
    href: links.reactRepo,
    title: 'GitHub',
    meta: 'React',
    icon: <Github size={20} />,
    badge: <ReactLogo size={12} className="brand-react" />,
  },
  {
    href: links.angularRepo,
    title: 'GitHub',
    meta: 'Angular',
    icon: <Github size={20} />,
    badge: <AngularLogo size={12} className="brand-angular" />,
  },
];

/** The places Pada lives outside this site: the Figma kit, both Storybooks and both repositories. */
export function ResourceCards() {
  return (
    <section className="resources" aria-label="Pada resources">
      <div className="wrap">
        <ul className="resource-grid">
          {RESOURCES.map((r, i) => (
            <li key={r.href} data-reveal style={{ ['--reveal-delay' as string]: `${i * 0.05}s` }}>
              <a
                className="resource-card"
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                data-featured={r.featured ? '' : undefined}
              >
                <span className="resource-icon" aria-hidden="true">
                  {r.icon}
                  {r.badge && <span className="resource-badge">{r.badge}</span>}
                </span>
                <span className="resource-copy">
                  <strong>{r.title}</strong>
                  <span>{r.meta}</span>
                </span>
                <ExternalArrow size={15} className="resource-ext" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
