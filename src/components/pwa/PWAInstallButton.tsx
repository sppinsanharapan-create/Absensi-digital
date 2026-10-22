/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone } from 'lucide-react';

interface Props {
  variant?: 'header' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed in standalone mode, do not show
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className="bg-emerald-800 text-white px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm shadow-md">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Pasang aplikasi <strong>Absensi Siswa</strong> di layar utama untuk akses cepat & offline</span>
          </div>
          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3 py-1 rounded-md text-xs transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalling ? 'Memasang...' : 'Pasang PWA'}</span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Pasang Aplikasi ke Layar Utama"
        className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition border border-emerald-500/40"
      >
        <Download className="w-3.5 h-3.5 text-amber-300" />
        <span className="hidden sm:inline">Pasang PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {variant === 'banner' ? (
          <div className="bg-emerald-800 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Gunakan aplikasi ini seperti aplikasi native di iPhone / iPad</span>
            </div>
            <button
              onClick={() => setShowIOSGuide(true)}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-2.5 py-1 rounded text-xs transition"
            >
              Petunjuk Pasang
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            title="Pasang di iOS Safari"
            className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-emerald-500/30"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Pasang di iOS</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                    IH
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Pasang di iPhone / iPad</h3>
                    <p className="text-[11px] text-slate-500">SIT Insan Harapan Batam</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">Ketuk tombol Bagikan (Share)</p>
                    <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                      Di bilah bawah Safari: <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">Pilih "Tambah ke Layar Utama"</p>
                    <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                      Gulir ke bawah dan cari <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" /> <em>Add to Home Screen</em>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">Buka langsung dari layar utama</p>
                    <p className="text-slate-500 mt-0.5">Aplikasi dapat dibuka cepat tanpa bilah Safari & bisa mencatat offline.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
              >
                Mengerti, Tutup
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that already provide install or don't support programmatic prompt
  return null;
};
