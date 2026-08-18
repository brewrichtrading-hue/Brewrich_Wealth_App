'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ScrollUnlockerCore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Force-reset body and html scroll locks left behind by modals or payment gateways
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.overflow = 'auto';
  }, [pathname, searchParams]);

  return null;
}

export default function GlobalScrollUnlocker() {
  return (
    <Suspense fallback={null}>
      <ScrollUnlockerCore />
    </Suspense>
  );
}
