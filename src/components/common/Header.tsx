/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { 
  Wifi, 
  WifiOff, 
  UserCheck, 
  History, 
  ChevronDown, 
  Building2,
  GraduationCap,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
  onOpenAuditLogs: () => void;
  pendingSyncCount: number;
  onQuickSync: () => void;
}

export const Header: React.FC<Props> = ({
  currentUser,
  allUsers,
  onSelectUser,
  isOnline,
  simulatedOffline,
  onToggleSimulateOffline,
  onOpenAuditLogs,
  pendingSyncCount,
  onQuickSync,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-950 p-0.5 shadow-md flex items-center justify-center border border-amber-400/40">
                <img 
                  src="/icon.svg" 
                  alt="SIT Insan Harapan Batam Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to stylized SVG icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              {/* Online/Offline miniature status dot on logo */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-emerald-900 ${
                  isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
                title={isOnline ? 'Online (Tersambung ke Server)' : 'Offline (Tersimpan Lokal)'}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-tight text-white flex items-center gap-1">
                  SIT INSAN HARAPAN
                  <span className="hidden sm:inline-block text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded">
                    BATAM
                  </span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium leading-none mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-300/80 shrink-0 hidden xs:inline" />
                <span>Yayasan Harapan Ibu Kepri</span>
                <span className="text-emerald-400 font-bold">•</span>
                <span className="text-amber-200 font-medium">Absensi PWA</span>
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online/Offline Toggle & Status Button */}
            <button
              onClick={onToggleSimulateOffline}
              title={`Status: ${isOnline ? 'Online' : 'Offline'}. Klik untuk simulasi ${isOnline ? 'Offline' : 'Online'}`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isOnline
                  ? 'bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border-emerald-700/60'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/50 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden md:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden md:inline">Offline</span>
                </>
              )}
              {pendingSyncCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 text-[10px] rounded-full">
                  {pendingSyncCount}
                </span>
              )}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton variant="header" />

            {/* Audit Log / Riwayat Button */}
            <button
              onClick={onOpenAuditLogs}
              title="Lihat Log Audit & Riwayat Perubahan"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-800/70 hover:bg-emerald-700/90 text-emerald-100 text-xs font-medium border border-emerald-700/60 transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">Log Audit</span>
            </button>

            {/* User Profile / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-emerald-800/90 hover:bg-emerald-700/90 text-white px-2.5 py-1.5 rounded-xl border border-emerald-600/50 shadow-sm text-left transition"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                  {currentUser.role === 'guru' ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : currentUser.role === 'yayasan' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-200 capitalize">
                    {currentUser.role === 'guru'
                      ? 'Guru / Wali Kelas'
                      : currentUser.role === 'staf'
                      ? 'Staf Administrasi'
                      : 'Pimpinan Yayasan'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              </button>

              {/* Role Dropdown Menu */}
              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ganti Peran Pengguna (Simulasi)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih peran untuk menguji alur hak akses PRD:
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {allUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSelectUser(user);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                              user.role === 'guru'
                                ? 'bg-blue-100 text-blue-700'
                                : user.role === 'staf'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {user.role === 'guru' ? 'G' : user.role === 'staf' ? 'S' : 'Y'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold truncate">{user.name}</p>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{user.roleTitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Versi PWA 1.0</span>
                    <button
                      onClick={() => {
                        onToggleSimulateOffline();
                        setShowUserDropdown(false);
                      }}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      {isOnline ? 'Tes Mode Offline' : 'Kembali Online'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
