import type { ReactNode } from 'react';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** Reuse an id to update a toast in place instead of adding another. */
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before it closes on its own. `Infinity` keeps it until dismissed. @default 5000 */
  duration?: number;
  /** One action button, e.g. Undo. */
  action?: ToastAction;
  /** Called after the toast closes, for any reason. */
  onDismiss?: () => void;
}

export interface ToastRecord extends Required<Pick<ToastOptions, 'id' | 'tone' | 'duration'>>, Omit<ToastOptions, 'id' | 'tone' | 'duration'> {
  /** False once dismissed: the Toaster plays the exit animation, then removes it. */
  open: boolean;
  createdAt: number;
}

type Listener = () => void;

let toasts: ToastRecord[] = [];
const listeners = new Set<Listener>();
let counter = 0;

const emit = () => listeners.forEach((listener) => listener());

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => toasts,
  /** Removes a closed toast after its exit animation. */
  remove(id: string) {
    toasts = toasts.filter((item) => item.id !== id);
    emit();
  },
};

function show(input: ReactNode | ToastOptions, defaults: Partial<ToastOptions> = {}): string {
  const options: ToastOptions =
    typeof input === 'object' && input !== null && !Array.isArray(input) && !('$$typeof' in (input as object))
      ? (input as ToastOptions)
      : { title: input as ReactNode };
  const merged = { ...defaults, ...options };
  const id = merged.id ?? `toast-${++counter}`;
  const record: ToastRecord = {
    tone: 'neutral',
    duration: 5000,
    ...merged,
    id,
    open: true,
    createdAt: Date.now(),
  };
  const existing = toasts.findIndex((item) => item.id === id);
  toasts = existing === -1 ? [...toasts, record] : toasts.map((item, index) => (index === existing ? record : item));
  emit();
  return id;
}

/**
 * Shows a toast and returns its id. Render one `<Toaster />` near the root of the app.
 *
 * ```ts
 * toast('Saved');
 * toast.success({ title: 'Invite sent', description: 'ada@example.com' });
 * toast.danger({ title: 'Upload failed', action: { label: 'Retry', onClick: retry } });
 * toast.dismiss(id);
 * ```
 */
export const toast = Object.assign((input: ReactNode | ToastOptions) => show(input), {
  success: (input: ReactNode | ToastOptions) => show(input, { tone: 'success' }),
  warning: (input: ReactNode | ToastOptions) => show(input, { tone: 'warning' }),
  danger: (input: ReactNode | ToastOptions) => show(input, { tone: 'danger' }),
  info: (input: ReactNode | ToastOptions) => show(input, { tone: 'info' }),
  /** Closes one toast, or all of them when called without an id. */
  dismiss(id?: string) {
    toasts = toasts.map((item) => {
      if (id !== undefined && item.id !== id) return item;
      if (item.open) item.onDismiss?.();
      return { ...item, open: false };
    });
    emit();
  },
});
