'use client';

import { useEffect, type ReactNode } from 'react';
import { startLenis, stopLenis } from '@/lib/lenis';

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    startLenis();
    return () => stopLenis();
  }, []);

  return children;
}
