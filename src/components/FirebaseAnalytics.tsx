'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

export default function FirebaseAnalytics() {
  useEffect(() => {
    initAnalytics().catch((err) => {
      console.debug('[FIREBASE] Analytics initialization skipped:', err);
    });
  }, []);

  return null;
}
