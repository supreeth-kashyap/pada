import { useEffect, useState, type ReactNode } from 'react';

/** Renders `fallback` on the server and during hydration, then `children` (for date-dependent UI). */
export function ClientOnly({ children, fallback = null }: { children: () => ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children() : fallback}</>;
}
