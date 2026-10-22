/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';

const SIMULATE_OFFLINE_KEY = 'insanharapan_simulate_offline_v1';

export function useOnlineStatus() {
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIMULATE_OFFLINE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulateOffline = useCallback(() => {
    setSimulatedOffline(prev => {
      const next = !prev;
      try {
        localStorage.setItem(SIMULATE_OFFLINE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Effective status: only online if both real browser is online AND simulation is off
  const isOnline = browserOnline && !simulatedOffline;

  return {
    isOnline,
    browserOnline,
    simulatedOffline,
    toggleSimulateOffline,
  };
}
