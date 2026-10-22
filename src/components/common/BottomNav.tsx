/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ClipboardCheck, 
  BarChart3, 
  Users, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavTab = 'absensi' | 'rekap' | 'manajemen' | 'dashboard';

interface Props {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingOfflineCount: number;
}

export const BottomNav: React.FC<Props> = ({
  activeTab,
  onChangeTab,
  userRole,
  pendingOfflineCount,
}) => {
  const items = [
    {
      id: 'absensi' as NavTab,
      label: 'Absensi',
      icon: ClipboardCheck,
      badge: pendingOfflineCount > 0 ? pendingOfflineCount : undefined,
    },
    {
      id: 'rekap' as NavTab,
      label: 'Rekap & Laporan',
      icon: BarChart3,
    },
    {
      id: 'manajemen' as NavTab,
      label: 'Data Sekolah',
      icon: Users,
      highlight: userRole === 'staf' || userRole === 'admin',
    },
    {
      id: 'dashboard' as NavTab,
      label: 'Yayasan & Audit',
      icon: LayoutDashboard,
      highlight: userRole === 'yayasan',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 relative transition-colors ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-700' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 truncate max-w-[70px] tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
