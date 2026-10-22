/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, CloudOff, AlertCircle } from 'lucide-react';

interface Props {
  isOnline: boolean;
  simulatedOffline: boolean;
  toggleSimulateOffline: () => void;
  pendingCount: number;
  onSync: () => void;
}

export const OfflineIndicator: React.FC<Props> = ({
  isOnline,
  simulatedOffline,
  toggleSimulateOffline,
  pendingCount,
  onSync,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = () => {
    if (!isOnline) {
      setSyncFeedback('Perangkat masih offline. Sinkronisasi akan otomatis saat online.');
      setTimeout(() => setSyncFeedback(null), 3500);
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      onSync();
      setSyncing(false);
      setSyncFeedback('Sinkronisasi selesai!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 600);
  };

  return (
    <>
      {/* Offline Alert Bar when disconnected */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-3.5 py-2 text-xs font-medium flex items-center justify-between shadow-sm sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
            <div>
              <span className="font-semibold">Mode Offline Aktif</span>
              <span className="hidden sm:inline"> — Absensi tetap dapat dicatat & disimpan aman di perangkat ini.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="bg-amber-700/80 px-2 py-0.5 rounded text-[11px] font-bold">
                {pendingCount} belum sinkron
              </span>
            )}
            {simulatedOffline && (
              <button
                onClick={toggleSimulateOffline}
                className="bg-amber-700 hover:bg-amber-800 text-amber-100 text-[10px] px-2 py-0.5 rounded font-mono transition"
                title="Matikan simulasi offline untuk kembali online"
              >
                Kembalikan Online
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Synced / Pending Queue Badge in bottom right */}
      {pendingCount > 0 && isOnline && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 bg-emerald-900/95 text-white border border-emerald-700 shadow-xl rounded-2xl p-3 flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <CloudOff className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">{pendingCount} Catatan Offline</p>
            <p className="text-emerald-200 text-[11px]">Koneksi kembali stabil</p>
          </div>
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow transition active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Sinkron...' : 'Sinkronkan'}</span>
          </button>
        </div>
      )}

      {/* Sync Toast Feedback */}
      {syncFeedback && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {syncFeedback.includes('selesai') ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          )}
          <span>{syncFeedback}</span>
        </div>
      )}
    </>
  );
};
