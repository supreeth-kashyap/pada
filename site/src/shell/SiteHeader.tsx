import { useEffect, useState } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { Drawer, PadaLogo } from 'pada-ds';
import { docs, links } from '../lib/docs';
import { ROUTES } from '../lib/paths';
import { ThemeSwitch } from './ThemeSwitch';
import { ArrowRight, Github, Menu, Storybook } from './icons';

const NAV = [
  { to: ROUTES.docs, label: 'Docs', end: true },
  { to: ROUTES.components, label: 'Components' },
  { to: ROUTES.tokens, label: 'Tokens' },
  { to: ROUTES.changelog, label: 'Changelog' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="site-header" data-scrolled={scrolled ? '' : undefined}>
      <div className="wrap">
        <RouterLink to="/" className="site-brand" aria-label="Pada home">
          <PadaLogo size={26} decorative />
          <span className="version">v{docs.version}</span>
        </RouterLink>
        <nav className="site-nav" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
          <a href={links.reactStorybook} target="_blank" rel="noopener noreferrer">
            Storybook
          </a>
        </nav>
        <div className="site-header-actions">
          <a className="icon-link hide-sm" href={links.reactStorybook} target="_blank" rel="noopener noreferrer" aria-label="Storybook (opens in a new tab)" title="Storybook">
            <Storybook size={17} />
          </a>
          <a className="icon-link hide-sm" href={links.reactRepo} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" title="GitHub">
            <Github size={18} />
          </a>
          <ThemeSwitch />
          <Drawer.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Drawer.Trigger asChild>
              <button type="button" className="icon-link menu-btn" aria-label="Open menu">
                <Menu size={18} />
              </button>
            </Drawer.Trigger>
            <Drawer.Content side="right" size="sm">
              <Drawer.Header>
                <Drawer.Title>Menu</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <nav className="mobile-nav" aria-label="Main">
                  <RouterLink to="/">Home <ArrowRight /></RouterLink>
                  {NAV.map((item) => (
                    <RouterLink key={item.to} to={item.to}>
                      {item.label} <ArrowRight />
                    </RouterLink>
                  ))}
                  <a href={links.reactStorybook} target="_blank" rel="noopener noreferrer">Storybook (React) <ArrowRight /></a>
                  <a href={links.angularStorybook} target="_blank" rel="noopener noreferrer">Storybook (Angular) <ArrowRight /></a>
                  <a href={links.reactRepo} target="_blank" rel="noopener noreferrer">GitHub <ArrowRight /></a>
                </nav>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </div>
      </div>
    </header>
  );
}
