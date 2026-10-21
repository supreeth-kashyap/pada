import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => <Svg className="arrow" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const ExternalArrow = (p: IconProps) => <Svg {...p}><path d="M7 17 17 7M8 7h9v9" /></Svg>;
export const Copy = (p: IconProps) => <Svg {...p}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></Svg>;
export const Check = (p: IconProps) => <Svg strokeWidth={2.4} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const Sun = (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>;
export const Moon = (p: IconProps) => <Svg {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></Svg>;
export const ChevronDown = (p: IconProps) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
export const Menu = (p: IconProps) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>;
export const Sparkle = (p: IconProps) => <Svg {...p}><path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18l-1.9-5.6L4.5 10.5l5.6-1.9Z" /></Svg>;
export const Keyboard = (p: IconProps) => <Svg {...p}><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 15h10" /></Svg>;
export const Layers = (p: IconProps) => <Svg {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></Svg>;
export const Droplet = (p: IconProps) => <Svg {...p}><path d="M12 3s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z" /></Svg>;
export const Wave = (p: IconProps) => <Svg {...p}><path d="M2 12c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-2" /></Svg>;
export const Figma = (p: IconProps) => <Svg {...p}><path d="M9 3h3v6H9a3 3 0 0 1 0-6ZM12 3h3a3 3 0 0 1 0 6h-3V3ZM9 9h3v6H9a3 3 0 0 1 0-6ZM15 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM9 15h3v3a3 3 0 1 1-3-3Z" /></Svg>;
export const Book = (p: IconProps) => <Svg {...p}><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h13" /></Svg>;
export const Box = (p: IconProps) => <Svg {...p}><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></Svg>;
export const Sliders = (p: IconProps) => <Svg {...p}><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="18" r="2" /></Svg>;
export const Palette = (p: IconProps) => <Svg {...p}><path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.7-.9 1.4-1.9l-.3-.9a1.6 1.6 0 0 1 1.5-2.2H17a4 4 0 0 0 4-4c0-5-4-9-9-9Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10.5" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></Svg>;
export const Grid = (p: IconProps) => <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>;
/** The Figma mark in its brand colours, for places that name Figma itself. */
export const FigmaLogo = ({ size = 18, ...p }: IconProps) => (
  <svg width={size * (2 / 3)} height={size} viewBox="0 0 38 57" aria-hidden="true" {...p}>
    <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
    <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" />
    <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
    <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
    <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" />
  </svg>
);
export const Github = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
export const Storybook = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M16.7.4 16.5 4a.3.3 0 0 0 .4.2l1.4-1-.1 3.6 2.9-.2.4 17.9-17-1L3.4 3.2 16.7.4Zm-3.3 7.8c0 .5 3 .3 3.4-.1 0-3.1-1.7-4.8-4.7-4.8s-4.7 1.7-4.7 4.2c0 4.4 6 4.5 6 6.9 0 .7-.3 1.1-1.1 1.1-1 0-1.4-.5-1.3-2.2 0-.4-3.5-.5-3.6 0-.3 4.1 2.2 5.3 5 5.3 2.8 0 5-1.5 5-4.2 0-4.8-6.1-4.7-6.1-7.1 0-1 .7-1.1 1.1-1.1.5 0 1.3.1 1.2 1.9Z" />
  </svg>
);
export const ReactLogo = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4.1" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4.1" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4.1" transform="rotate(120 12 12)" />
  </svg>
);
export const AngularLogo = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path fillRule="evenodd" d="M12 1.5 2.3 5l1.5 12.8L12 22.5l8.2-4.7L21.7 5 12 1.5Zm0 2.6-6 13.4h2.3l1.2-3h5l1.2 3H18L12 4.1Zm0 4.6 1.8 4.1h-3.6L12 8.7Z" />
  </svg>
);
