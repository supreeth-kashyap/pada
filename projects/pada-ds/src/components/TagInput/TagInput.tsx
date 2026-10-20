import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { FieldControl } from '../../headless/Field/Field';
import { useControllableState } from '../../headless/utils/useControllableState';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field/Field';
import './TagInput.css';

const cx = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export interface TagInputProps {
  label: string;
  /** Controlled tags. */
  value?: string[];
  /** Initial tags when uncontrolled. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  description?: string;
  error?: string;
  /** Keys that turn the typed text into a tag. @default ['Enter', ','] */
  separators?: string[];
  /** Maximum number of tags. */
  maxTags?: number;
  /** Allow the same tag twice. @default false */
  allowDuplicates?: boolean;
  /** Return an error message to reject a tag. */
  validate?: (tag: string) => string | null | undefined;
  /** Turn left-over text into a tag when the field loses focus. @default true */
  addOnBlur?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Submits each tag with forms under this name. */
  name?: string;
  className?: string;
}

/**
 * Free-form tags (emails, keywords, labels) typed into one field. Enter or a comma adds the text
 * as a tag; pasting a comma- or line-separated list adds them all. Backspace in the empty field
 * moves to the tags, where Backspace or Delete removes one and the arrow keys move between them.
 * For picking from known options, use Autocomplete with `multiple`.
 */
export function TagInput({
  label,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder,
  description,
  error,
  separators = ['Enter', ','],
  maxTags,
  allowDuplicates = false,
  validate,
  addOnBlur = true,
  disabled = false,
  required,
  name,
  className,
}: TagInputProps) {
  const id = useId();
  const [tags, setTags] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange });
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const full = maxTags !== undefined && tags.length >= maxTags;

  const removeButtons = () => Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);

  /** Adds every valid candidate; keeps the rest (and the first error) in the field. */
  const add = (candidates: string[]) => {
    const next = [...tags];
    const rejected: string[] = [];
    let firstError: string | null = null;
    for (const raw of candidates) {
      const tag = raw.trim();
      if (!tag) continue;
      const problem =
        (maxTags !== undefined && next.length >= maxTags && `Up to ${maxTags} tags.`) ||
        (!allowDuplicates && next.some((existing) => existing.toLowerCase() === tag.toLowerCase()) && `"${tag}" is already added.`) ||
        validate?.(tag) ||
        null;
      if (problem) {
        firstError ??= problem;
        rejected.push(tag);
      } else {
        next.push(tag);
      }
    }
    const added = next.slice(tags.length);
    if (added.length) {
      setTags(next);
      setAnnouncement(`Added ${added.join(', ')}. ${next.length} ${next.length === 1 ? 'tag' : 'tags'}.`);
    }
    setInputError(firstError);
    setText(rejected.join(', '));
  };

  const remove = (index: number, focusAfter: 'neighbour' | 'input' = 'neighbour') => {
    const tag = tags[index];
    const next = tags.filter((_, position) => position !== index);
    setTags(next);
    setInputError(null);
    setAnnouncement(`Removed ${tag}. ${next.length} ${next.length === 1 ? 'tag' : 'tags'}.`);
    // After the list re-renders, keep focus nearby.
    requestAnimationFrame(() => {
      const buttons = removeButtons();
      if (focusAfter === 'input' || buttons.length === 0) inputRef.current?.focus();
      else buttons[Math.min(index, buttons.length - 1)]?.focus();
    });
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(event.key) && !event.nativeEvent.isComposing) {
      if (!text.trim()) return;
      event.preventDefault();
      add([text]);
    } else if ((event.key === 'Backspace' || event.key === 'ArrowLeft') && event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0 && tags.length) {
      event.preventDefault();
      removeButtons().at(-1)?.focus();
    }
  };

  const onTagKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const buttons = removeButtons();
    if (event.key === 'ArrowLeft') buttons[Math.max(0, index - 1)]?.focus();
    else if (event.key === 'ArrowRight') (buttons[index + 1] ?? inputRef.current)?.focus();
    else if (event.key === 'Backspace' || event.key === 'Delete') remove(index);
    else return;
    event.preventDefault();
  };

  const shownError = error ?? inputError ?? undefined;

  return (
    <FieldRoot className={cx('tag-input-field', className)} invalid={!!shownError} required={required} disabled={disabled} controlId={id}>
      <FieldLabel>{label}</FieldLabel>
      <div className="tag-input" data-disabled={disabled ? '' : undefined} onClick={(event) => event.target === event.currentTarget && inputRef.current?.focus()}>
        {tags.length > 0 && (
          <ul ref={listRef} className="tag-input-tags" aria-label={`${label}: ${tags.length} ${tags.length === 1 ? 'tag' : 'tags'}`}>
            {tags.map((tag, index) => (
              <li key={`${tag}-${index}`} className="tag-input-tag">
                <span className="tag-input-tag-label">{tag}</span>
                <button
                  type="button"
                  className="tag-input-remove"
                  aria-label={`Remove ${tag}`}
                  disabled={disabled}
                  tabIndex={-1}
                  onClick={() => remove(index, 'input')}
                  onKeyDown={(event) => onTagKeyDown(event, index)}
                >
                  <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        <FieldControl asChild>
          <input
            ref={inputRef}
            className="tag-input-input"
            value={text}
            placeholder={full ? undefined : placeholder}
            readOnly={full}
            aria-readonly={full || undefined}
            enterKeyHint="enter"
            onChange={(event) => {
              setInputError(null);
              setText(event.target.value);
            }}
            onKeyDown={onInputKeyDown}
            onPaste={(event) => {
              const pasted = event.clipboardData.getData('text');
              if (!/[,\n;]/.test(pasted)) return;
              event.preventDefault();
              add([text, ...pasted.split(/[,\n;]/)]);
            }}
            onBlur={() => addOnBlur && text.trim() && add([text])}
          />
        </FieldControl>
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {shownError && <FieldError>{shownError}</FieldError>}
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {announcement}
      </VisuallyHidden>
      {name && tags.map((tag, index) => <input key={index} type="hidden" name={name} value={tag} disabled={disabled} />)}
    </FieldRoot>
  );
}
