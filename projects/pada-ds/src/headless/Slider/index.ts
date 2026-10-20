import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from './Slider';

export * from './Slider';

/**
 * Headless slider with one or more thumbs (WAI-ARIA APG Slider and Multi-Thumb Slider).
 *
 * ```tsx
 * <Slider.Root defaultValue={[20, 80]} min={0} max={100}>
 *   <Slider.Track>
 *     <Slider.Range />
 *   </Slider.Track>
 *   <Slider.Thumb index={0} aria-label="Minimum" />
 *   <Slider.Thumb index={1} aria-label="Maximum" />
 * </Slider.Root>
 * ```
 */
export const Slider = {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
};
