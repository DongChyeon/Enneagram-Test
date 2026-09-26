'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { configureAnalyticsPage } from '../lib/analytics';

export function AnalyticsProvider() {
  const pathname = usePathname();
  useEffect(() => { configureAnalyticsPage(pathname); }, [pathname]);
  return null;
}
