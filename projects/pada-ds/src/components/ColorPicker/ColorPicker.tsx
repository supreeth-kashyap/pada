import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '../../headless/Slider/Slider';
import { dataFlag } from '../../headless/utils/events';
import { formatColor, formatHex, MAX_CHROMA, oklchToRgb, parseColor, toGamut, type ColorFormat, type Oklch } from './color';
import './ColorPicker.css';

export interface ColorSwatch {
  value: string;
  /** Accessible name, e.g. "Brand indigo". Defaults to the value. */
  label?: string;
}

export interface ColorPickerProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Accessible name of the picker, e.g. "Accent colour". */
  label: string;
  /** Controlled colour: `#rrggbb` or `oklch(L C H)`. */
  value?: string;
  /** Initial colour when uncontrolled. @default '#4f46e5' */
  defaultValue?: string;
  /** Called with the new colour, in `format`, on every change. */
  onValueChange?: (value: string) => void;
  /**
   * Output format. `hex` maps the colour into sRGB; `oklch` keeps exactly what was chosen,
   * which may be outside sRGB on wide-gamut screens. @default 'hex'
   */
  format?: ColorFormat;
  /** Preset colours shown under the controls. */
  swatches?: (string | ColorSwatch)[];
  disabled?: boolean;
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const percent = (value: number) => `${Math.round(value * 100)}%`;

/** Area resolution: painted small and scaled up by CSS, which smooths it. */
const AREA_WIDTH = 96;
const AREA_HEIGHT = 64;

function paintArea(canvas: HTMLCanvasElement | null, hue: number) {
  const context = canvas?.getContext?.('2d');
  if (!canvas || !context) return;
  const image = context.createImageData(AREA_WIDTH, AREA_HEIGHT);
  for (let y = 0; y < AREA_HEIGHT; y += 1) {
    for (let x = 0; x < AREA_WIDTH; x += 1) {
      const color = toGamut({ l: 1 - y / (AREA_HEIGHT - 1), c: (x / (AREA_WIDTH - 1)) * MAX_CHROMA, h: hue });
      const [r, g, b] = oklchToRgb(color);
      const offset = (y * AREA_WIDTH + x) * 4;
      image.data[offset] = clamp(r, 0, 1) * 255;
      image.data[offset + 1] = clamp(g, 0, 1) * 255;
      image.data[offset + 2] = clamp(b, 0, 1) * 255;
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
}

/**
 * Pick a colour in OKLCH, the perceptual colour space Pada's tokens use: an area for chroma
 * (left to right) and lightness (bottom to top), a hue slider, a hex field and optional swatches.
 * Colours outside sRGB are shown at their nearest displayable colour.
 */
export function ColorPicker({
  label,
  value: valueProp,
  defaultValue = '#4f46e5',
  onValueChange,
  format = 'hex',
  swatches,
  disabled = false,
  className,
  ...props
}: ColorPickerProps) {
  const id = useId();
  const [color, setColorState] = useState<Oklch>(() => parseColor(valueProp ?? defaultValue) ?? { l: 0.5, c: 0.2, h: 277 });
  // The last value this picker emitted, so a controlled value that echoes it back does not
  // re-parse (hex rounding would otherwise nudge the thumb).
  const emitted = useRef<string | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const hex = formatHex(color);
  const [hexDraft, setHexDraft] = useState<string | null>(null);

  useEffect(() => {
    if (valueProp === undefined || valueProp === emitted.current) return;
    const parsed = parseColor(valueProp);
    if (parsed) setColorState(parsed);
  }, [valueProp]);

  useEffect(() => paintArea(canvasRef.current, color.h), [color.h]);

  const setColor = (next: Oklch) => {
    const normalized = { l: clamp(next.l, 0, 1), c: clamp(next.c, 0, MAX_CHROMA), h: ((next.h % 360) + 360) % 360 };
    setColorState(normalized);
    const output = formatColor(normalized, format);
    emitted.current = output;
    onValueChange?.(output);
  };

  const fromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = areaRef.current!.getBoundingClientRect();
    const x = clamp((event.clientX - box.left) / (box.width || 1), 0, 1);
    const y = clamp((event.clientY - box.top) / (box.height || 1), 0, 1);
    setColor({ ...color, c: x * MAX_CHROMA, l: 1 - y });
  };

  const handleAreaKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const large = event.shiftKey ? 10 : 1;
    const moves: Record<string, Partial<Oklch>> = {
      ArrowRight: { c: color.c + 0.005 * large },
      ArrowLeft: { c: color.c - 0.005 * large },
      ArrowUp: { l: color.l + 0.01 * large },
      ArrowDown: { l: color.l - 0.01 * large },
      PageUp: { l: color.l + 0.1 },
      PageDown: { l: color.l - 0.1 },
      Home: { c: 0 },
      End: { c: MAX_CHROMA },
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setColor({ ...color, ...moves[event.key] });
  };

  const commitHex = () => {
    if (hexDraft === null) return;
    const parsed = parseColor(hexDraft);
    if (parsed) setColor(parsed);
    setHexDraft(null);
  };

  const items = (swatches ?? []).map((swatch) => (typeof swatch === 'string' ? { value: swatch } : swatch));
  const displayed = toGamut(color);

  return (
    <div
      role="group"
      aria-label={label}
      data-disabled={dataFlag(disabled)}
      {...props}
      className={['color-picker', className].filter(Boolean).join(' ')}
      style={{ '--pada-color-picker-value': hex, '--pada-color-picker-hue': color.h, ...props.style } as CSSProperties}
    >
      <div
        ref={areaRef}
        className="color-picker-area"
        onPointerDown={(event) => {
          if (disabled || event.button !== 0) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture?.(event.pointerId);
          fromPointer(event);
          event.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
          event.preventDefault();
        }}
        onPointerMove={(event) => dragging.current && fromPointer(event)}
        onPointerUp={(event) => {
          dragging.current = false;
          event.currentTarget.releasePointerCapture?.(event.pointerId);
        }}
      >
        <canvas ref={canvasRef} width={AREA_WIDTH} height={AREA_HEIGHT} className="color-picker-canvas" aria-hidden="true" />
        <span
          role="slider"
          tabIndex={disabled ? undefined : 0}
          aria-label="Lightness and chroma"
          aria-roledescription="2D slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(color.l * 100)}
          aria-valuetext={`Lightness ${percent(color.l)}, chroma ${color.c.toFixed(3)}`}
          aria-disabled={disabled || undefined}
          className="color-picker-thumb"
          style={{ left: `${(color.c / MAX_CHROMA) * 100}%`, top: `${(1 - color.l) * 100}%` }}
          onKeyDown={handleAreaKeyDown}
        />
      </div>

      <div className="color-picker-row">
        <span className="color-picker-preview" aria-hidden="true" />
        <SliderRoot
          className="color-picker-hue"
          min={0}
          max={360}
          step={1}
          value={[Math.round(color.h)]}
          onValueChange={([hue]) => setColor({ ...color, h: hue })}
          disabled={disabled}
        >
          <SliderTrack className="color-picker-hue-track">
            <SliderRange className="color-picker-hue-range" />
          </SliderTrack>
          <SliderThumb className="color-picker-hue-thumb" aria-label="Hue" aria-valuetext={`Hue ${Math.round(color.h)}°`} />
        </SliderRoot>
      </div>

      <div className="color-picker-row">
        <label className="color-picker-field" htmlFor={`${id}hex`}>
          <span className="color-picker-field-label">Hex</span>
          <input
            id={`${id}hex`}
            className="color-picker-input"
            value={hexDraft ?? hex}
            spellCheck={false}
            autoComplete="off"
            disabled={disabled}
            aria-invalid={hexDraft !== null && !parseColor(hexDraft) ? true : undefined}
            onChange={(event) => setHexDraft(event.target.value)}
            onBlur={commitHex}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitHex();
              if (event.key === 'Escape' && hexDraft !== null) {
                event.stopPropagation();
                setHexDraft(null);
              }
            }}
          />
        </label>
        <output className="color-picker-oklch" htmlFor={`${id}hex`} aria-label="OKLCH">
          {formatColor(displayed, 'oklch').replace(/^oklch\(|\)$/g, '')}
        </output>
      </div>

      {items.length > 0 && (
        <div className="color-picker-swatches" role="group" aria-label="Swatches">
          {items.map((swatch) => {
            const parsed = parseColor(swatch.value);
            const selected = !!parsed && formatHex(parsed) === hex;
            return (
              <button
                key={swatch.value}
                type="button"
                className="color-picker-swatch"
                aria-label={swatch.label ?? swatch.value}
                aria-pressed={selected}
                disabled={disabled || !parsed}
                style={{ '--pada-color-picker-swatch': parsed ? formatHex(parsed) : 'transparent' } as CSSProperties}
                onClick={() => parsed && setColor(parsed)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
