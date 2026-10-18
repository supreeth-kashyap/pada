import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import './EmptyState.css';

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  /** Built-in icon name, or any element (an illustration). */
  media?: string | ReactNode;
  /** What is empty, e.g. "No projects yet". */
  title: ReactNode;
  /** Why it is empty and what to do next. */
  description?: ReactNode;
  /** The next step: usually one primary button. */
  actions?: ReactNode;
  /** `sm` for inside cards and tables, `md` for whole pages. */
  size?: 'sm' | 'md';
  /** Heading level of the title. */
  headingLevel?: 2 | 3 | 4;
}

/** First-use, no-results and error placeholders, with a clear next step. */
export function EmptyState({ media, title, description, actions, size = 'md', headingLevel = 3, className, ...props }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div data-size={size} {...props} className={['empty-state', className].filter(Boolean).join(' ')}>
      {media && (
        <div className="empty-state-media" aria-hidden="true">
          {typeof media === 'string' ? <Icon name={media} size={size === 'sm' ? 24 : 32} /> : media}
        </div>
      )}
      <Heading className="empty-state-title">{title}</Heading>
      {description && <p className="empty-state-description">{description}</p>}
      {actions && <div className="empty-state-actions">{actions}</div>}
    </div>
  );
}
