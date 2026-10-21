import { useReveal } from '../lib/useReveal';
import { Hero } from './Hero';
import { StatsStrip } from './StatsStrip';
import { ResourceCards } from './ResourceCards';
import { FigmaSection } from './FigmaSection';
import { FrameworkSection } from './FrameworkSection';
import { Features } from './Features';
import { Playground } from './Playground';
import { TokenArchitecture } from './TokenArchitecture';
import { MotionReel } from './MotionReel';
import { Gallery } from './Gallery';
import { AccessibilitySection } from './AccessibilitySection';
import { InstallSection } from './InstallSection';
import { BuildWithAI } from './BuildWithAI';
import { Faq } from './Faq';
import { FinalCta } from './FinalCta';

export function LandingPage() {
  useReveal();
  return (
    <main id="main" className="landing">
      <Hero />
      <ResourceCards />
      <StatsStrip />
      <Features />
      <Playground />
      <TokenArchitecture />
      <FrameworkSection />
      <FigmaSection />
      <MotionReel />
      <Gallery />
      <AccessibilitySection />
      <InstallSection />
      <BuildWithAI />
      <Faq />
      <FinalCta />
    </main>
  );
}
