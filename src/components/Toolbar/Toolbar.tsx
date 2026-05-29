import React from 'react';
import './Toolbar.css';
import { Button, type ButtonProps } from '../Button';

/**
 * Each entry in `actions` / `primaryAction` is a Button descriptor. The
 * Toolbar uses these to render `<Button>` instances internally, which:
 *   1. Enforces design-system consistency \u2014 every right-side affordance is a
 *      proper `<Button>`, not a hand-rolled `<button>` with one-off styles.
 *   2. Lets consumers pass plain data instead of JSX, which is also easier to
 *      serialise / drive from configuration.
 * A stable `id` is required so React can key the rendered list.
 */
export interface ToolbarActionProps extends ButtonProps {
  id: string;
}

export interface ToolbarProps {
  /**
   * Content rendered on the left side of the toolbar. Typically a view-switching
   * Select / SegmentControl followed by `<Filter>` and `<MoreFilter>` chips.
   */
  left?: React.ReactNode;
  /**
   * Optional ghost / tertiary buttons rendered in the right cluster, in order,
   * to the left of `primaryAction`. Toolbar renders these as `<Button>`
   * components so the right cluster is design-system-pure by construction.
   * Defaults each entry to `variant: 'ghost'`.
   */
  actions?: ToolbarActionProps[];
  /**
   * Optional single primary call-to-action rendered at the far right.
   * Defaults to `variant: 'secondary'`.
   */
  primaryAction?: ToolbarActionProps;
  /**
   * Legacy pass-through. If `children` is set and the structured props above
   * are not, the toolbar behaves as a single-slot flex container.
   */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Toolbar \u2014 Figma node 22:947.
 *
 * Two-slot layout: a left cluster of filters / view-switcher, a right cluster
 * built from typed Button descriptors. The right cluster always renders
 * design-system `<Button>` components \u2014 consumers can't slip in custom
 * button markup.
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  left,
  actions,
  primaryAction,
  children,
  className = ''
}) => {
  const hasStructured = left !== undefined || actions !== undefined || primaryAction !== undefined;
  if (hasStructured) {
    return (
      <div className={`toolbar toolbar--split ${className}`.trim()}>
        <div className="toolbar__cluster toolbar__cluster--left">{left}</div>
        <div className="toolbar__cluster toolbar__cluster--right">
          {actions?.map(({ id, variant = 'ghost', ...rest }) => (
            <Button key={id} variant={variant} {...rest} />
          ))}
          {primaryAction && (() => {
            const { id, variant = 'secondary', ...rest } = primaryAction;
            return <Button key={id} variant={variant} {...rest} />;
          })()}
        </div>
      </div>
    );
  }
  return (
    <div className={`toolbar ${className}`.trim()}>
      {children}
    </div>
  );
};
