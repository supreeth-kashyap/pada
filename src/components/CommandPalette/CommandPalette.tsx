import { useEffect, useId, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from '../../headless/Dialog/Dialog';
import { VisuallyHidden } from '../../headless/utils/VisuallyHidden';
import { useControllableState } from '../../headless/utils/useControllableState';
import { Icon } from '../Icon';
import { Kbd } from '../Kbd';
import { bestScore } from './commandScore';
import './CommandPalette.css';

export interface Command {
  id: string;
  label: string;
  /** Heading the command is listed under. */
  group?: string;
  /** Extra words that should find this command ("settings" for "Preferences"). */
  keywords?: string[];
  /** Second line under the label. */
  description?: string;
  /** Built-in icon name. */
  icon?: string;
  /** Keys shown as a hint, e.g. `['⌘', 'S']`. Display only. */
  shortcut?: string[];
  disabled?: boolean;
  /** Runs after the palette closes. */
  onSelect: () => void;
}

export interface CommandPaletteProps {
  commands: Command[];
  /** Controlled open state. */
  open?: boolean;
  /** Called when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  /** Shown when nothing matches. */
  emptyMessage?: string;
  /**
   * Key that toggles the palette together with ⌘ (macOS) or Ctrl (elsewhere). `false` disables
   * the shortcut.
   */
  hotkey?: string | false;
  /** Accessible name of the dialog. */
  label?: string;
}

interface Result {
  command: Command;
  score: number;
}

/**
 * A searchable list of actions in a dialog, opened with ⌘K / Ctrl+K. Type to filter (fuzzy,
 * ranked), arrows to move, Enter to run.
 */
export function CommandPalette({
  commands,
  open: openProp,
  onOpenChange,
  placeholder = 'Type a command or search…',
  emptyMessage = 'No results',
  hotkey = 'k',
  label = 'Command palette',
}: CommandPaletteProps) {
  const [open, setOpen] = useControllableState({ prop: openProp, defaultProp: false, onChange: onOpenChange });
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const baseId = useId();
  const listboxId = `${baseId}list`;
  const optionId = (id: string) => `${baseId}option-${id}`;

  useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hotkey, open, setOpen]);

  // Results grouped in first-seen group order, each group sorted by score.
  const groups = useMemo(() => {
    const scored: Result[] = commands
      .map((command) => ({ command, score: bestScore(command.label, command.keywords, query) }))
      .filter((result) => result.score > 0);
    const byGroup = new Map<string, Result[]>();
    for (const result of scored) {
      const key = result.command.group ?? '';
      byGroup.set(key, [...(byGroup.get(key) ?? []), result]);
    }
    return [...byGroup.entries()].map(([heading, results]) => ({
      heading,
      results: query ? [...results].sort((a, b) => b.score - a.score) : results,
    }));
  }, [commands, query]);
  const flat = groups.flatMap((group) => group.results.map((result) => result.command)).filter((command) => !command.disabled);
  const active = flat.find((command) => command.id === activeId) ?? flat[0] ?? null;

  const run = (command: Command) => {
    setOpen(false);
    setQuery('');
    // Let the dialog close (and focus return) before the command runs.
    window.setTimeout(() => command.onSelect(), 0);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const index = active ? flat.indexOf(active) : -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (flat.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveId(flat[(index + step + flat.length) % flat.length].id);
    } else if (event.key === 'Enter' && active) {
      event.preventDefault();
      run(active);
    }
  };

  useEffect(() => {
    if (active) document.getElementById(optionId(active.id))?.scrollIntoView({ block: 'nearest' });
    // optionId is derived from a stable id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
    >
      <DialogPortal>
        <DialogOverlay className="dialog-overlay" />
        <DialogContent className="command-palette" aria-describedby={undefined}>
          <VisuallyHidden>
            <DialogTitle>{label}</DialogTitle>
          </VisuallyHidden>
          <div className="command-palette-search">
            <Icon name="search" size={16} aria-hidden="true" className="command-palette-search-icon" />
            <input
              className="command-palette-input"
              role="combobox"
              aria-label={label}
              aria-expanded="true"
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={active ? optionId(active.id) : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder={placeholder}
              value={query}
              data-autofocus=""
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveId(null);
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="command-palette-list" id={listboxId} role="listbox" aria-label={label}>
            {groups.map((group) => (
              <div key={group.heading} role="group" aria-labelledby={group.heading ? `${baseId}group-${group.heading}` : undefined} className="command-palette-group">
                {group.heading && (
                  <div id={`${baseId}group-${group.heading}`} className="command-palette-heading" role="presentation">
                    {group.heading}
                  </div>
                )}
                {group.results.map(({ command }) => (
                  <div
                    key={command.id}
                    id={optionId(command.id)}
                    role="option"
                    aria-selected={active?.id === command.id}
                    aria-disabled={command.disabled || undefined}
                    data-highlighted={active?.id === command.id ? '' : undefined}
                    data-disabled={command.disabled ? '' : undefined}
                    className="command-palette-item"
                    onPointerMove={() => !command.disabled && active?.id !== command.id && setActiveId(command.id)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => !command.disabled && run(command)}
                  >
                    {command.icon && <Icon name={command.icon} size={16} aria-hidden="true" className="command-palette-item-icon" />}
                    <span className="command-palette-item-text">
                      <span>{command.label}</span>
                      {command.description && <span className="command-palette-item-description">{command.description}</span>}
                    </span>
                    {command.shortcut && <Kbd keys={command.shortcut} aria-hidden="true" />}
                  </div>
                ))}
              </div>
            ))}
            {flat.length === 0 && <div className="command-palette-empty">{emptyMessage}</div>}
          </div>
          <div className="command-palette-footer" aria-hidden="true">
            <span>
              <Kbd keys={['↑', '↓']} /> to navigate
            </span>
            <span>
              <Kbd>↵</Kbd> to run
            </span>
            <span>
              <Kbd>esc</Kbd> to close
            </span>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
