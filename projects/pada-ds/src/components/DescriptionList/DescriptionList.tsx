import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Avatar } from '../Avatar';
import { Badge, type BadgeTone } from '../Badge';
import { Button } from '../Button';
import { InfoTooltip } from '../InfoTooltip';
import './DescriptionList.css';

/** One value in a row. A row shows its values side by side, wrapping as needed. */
export type DescriptionListValue =
  | { type: 'text'; text: string }
  | { type: 'avatar'; name: string; src?: string; subtitle?: string }
  | { type: 'badge'; label: string; tone?: BadgeTone }
  | { type: 'button'; label: string; disabled?: boolean }
  | { type: 'custom'; content: ReactNode };

/** A term and its values. */
export interface DescriptionListRow {
  key: string;
  /** Help text behind an info button next to the key. */
  tooltip?: string;
  value: DescriptionListValue[];
}

/** An item at the end of a section header. */
export type DescriptionListSlotItem =
  | { type: 'button'; label: string; disabled?: boolean }
  | { type: 'badge'; label: string; tone?: BadgeTone };

export interface DescriptionListHeader {
  label: string;
  /** Help text behind an info button next to the label. */
  tooltip?: string;
  slot?: DescriptionListSlotItem[];
}

export interface DescriptionListSection {
  header: DescriptionListHeader;
  rows: DescriptionListRow[];
}

export interface DescriptionListData {
  sections: DescriptionListSection[];
}

export type DescriptionListEvent =
  | { type: 'section-slot-click'; sectionLabel: string; item: DescriptionListSlotItem }
  | { type: 'row-button-click'; sectionLabel: string; key: string; label: string; index: number };

export interface DescriptionListProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** The sections to show. */
  data: DescriptionListData;
  /**
   * A header slot button or a row button was pressed. Row buttons report the row key, their
   * label and their position in the row's `value`.
   */
  onAction?: (event: DescriptionListEvent) => void;
}

function Value({ value, onButton }: { value: DescriptionListValue; onButton: () => void }) {
  switch (value.type) {
    case 'text':
      return <span className="description-list-text">{value.text}</span>;
    case 'avatar':
      return (
        <span className="description-list-avatar">
          {/* The name is right next to it, so the picture is not announced twice. */}
          <span className="description-list-avatar-picture" aria-hidden="true">
            <Avatar name={value.name} src={value.src} />
          </span>
          <span className="description-list-avatar-info">
            <span className="description-list-avatar-name">{value.name}</span>
            {value.subtitle && <span className="description-list-avatar-subtitle">{value.subtitle}</span>}
          </span>
        </span>
      );
    case 'badge':
      return <Badge tone={value.tone ?? 'neutral'}>{value.label}</Badge>;
    case 'button':
      return (
        <Button variant="secondary" size="sm" disabled={value.disabled ?? false} onClick={onButton}>
          {value.label}
        </Button>
      );
    case 'custom':
      return <>{value.content}</>;
  }
}

/**
 * Sections of terms and values (a record's attributes), from data: a header per section, then a
 * description list (`dl`, `dt`, `dd`) of rows. Values can be text, an avatar with a name, a
 * badge, a button, or your own content.
 *
 * ```tsx
 * <DescriptionList
 *   data={{
 *     sections: [{
 *       header: { label: 'Ownership', slot: [{ type: 'button', label: 'Edit' }] },
 *       rows: [
 *         { key: 'Owner', value: [{ type: 'avatar', name: 'Anna Banks', subtitle: 'HR' }] },
 *         { key: 'Status', tooltip: 'Current state', value: [{ type: 'badge', label: 'Active', tone: 'success' }] },
 *       ],
 *     }],
 *   }}
 *   onAction={handleAction}
 * />
 * ```
 *
 * Each section is a `role="group"` named by its header. Differences from Angular: a `custom`
 * value takes any React node (Angular takes a component or a template), and avatars take no
 * `initials` (React's Avatar derives them from the name).
 */
export function DescriptionList({ data, onAction, className, ...props }: DescriptionListProps) {
  const id = useId();
  return (
    <div {...props} className={['description-list', className].filter(Boolean).join(' ')}>
      {data.sections.map((section, sectionIndex) => {
        const labelId = `${id}-section-${sectionIndex}`;
        const { header } = section;
        return (
          <div className="description-list-section" role="group" aria-labelledby={labelId} key={sectionIndex}>
            <div className="description-list-header">
              <div className="description-list-header-title">
                <span className="description-list-header-label" id={labelId}>
                  {header.label}
                </span>
                {header.tooltip && <InfoTooltip label={header.label} text={header.tooltip} />}
              </div>
              {header.slot?.length ? (
                <div className="description-list-header-slot">
                  {header.slot.map((item, index) =>
                    item.type === 'button' ? (
                      <Button
                        key={index}
                        variant="secondary"
                        size="sm"
                        disabled={item.disabled ?? false}
                        onClick={() => onAction?.({ type: 'section-slot-click', sectionLabel: header.label, item })}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <Badge key={index} tone={item.tone ?? 'neutral'}>
                        {item.label}
                      </Badge>
                    ),
                  )}
                </div>
              ) : null}
            </div>
            <dl className="description-list-rows">
              {section.rows.map((row, rowIndex) => (
                <div className="description-list-row" key={rowIndex}>
                  <dt className="description-list-key">
                    <span className="description-list-key-text">{row.key}</span>
                    {row.tooltip && <InfoTooltip label={row.key} text={row.tooltip} />}
                  </dt>
                  <dd className="description-list-value">
                    {row.value.map((value, index) => (
                      <Value
                        key={index}
                        value={value}
                        onButton={() =>
                          value.type === 'button' &&
                          onAction?.({
                            type: 'row-button-click',
                            sectionLabel: header.label,
                            key: row.key,
                            label: value.label,
                            index,
                          })
                        }
                      />
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
