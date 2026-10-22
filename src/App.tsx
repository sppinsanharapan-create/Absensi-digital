/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, SchoolClass } from './types';
import { StorageService } from './services/storageService';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { AttendanceSheet } from './components/attendance/AttendanceSheet';
import { ReportView } from './components/reports/ReportView';
import { SchoolManagement } from './components/management/SchoolManagement';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { AuditLogModal } from './components/audit/AuditLogModal';
import { 
  ClipboardCheck, 
  BarChart3, 
  Users, 
  LayoutDashboard,
  WifiOff,
  CloudCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Initialize storage
  useEffect(() => {
    StorageService.init();
  }, []);

  // Online / Offline Hook
  const { isOnline, simulatedOffline, toggleSimulateOffline } = useOnlineStatus();

  // Active User & Roles
  const [allUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());

  // Active Classes
  const [classes, setClasses] = useState<SchoolClass[]>(() => StorageService.getClasses());

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('absensi');

  // Audit Logs Modal
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // Pending Offline Queue Count
  const [pendingOfflineCount, setPendingOfflineCount] = useState<number>(() => {
    return StorageService.getOfflineQueue().length;
  });

  // Cross-navigation between report & attendance
  const [initialClassForAttendance, setInitialClassForAttendance] = useState<string | undefined>(undefined);
  const [initialClassForReport, setInitialClassForReport] = useState<string | undefined>(undefined);

  // Global Toast Alert
  const [globalToast, setGlobalToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setGlobalToast({ message, type });
    setTimeout(() => {
      setGlobalToast(null);
    }, 3500);
  }, []);

  const refreshOfflineCount = useCallback(() => {
    const count = StorageService.getOfflineQueue().length;
    setPendingOfflineCount(count);
  }, []);

  // Handle User Switching
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    showToast(`Beralih peran ke: ${user.name} (${user.roleTitle})`, 'info');
  };

  // Perform Synchronization
  const handlePerformSync = useCallback(() => {
    if (!isOnline) {
      showToast('Tidak dapat menyinkronkan saat offline.', 'info');
      return;
    }
    const result = StorageService.syncOfflineQueue(currentUser);
    refreshOfflineCount();
    showToast(result.message, 'success');
  }, [isOnline, currentUser, refreshOfflineCount, showToast]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      const queue = StorageService.getOfflineQueue();
      if (queue.length > 0) {
        const timer = setTimeout(() => {
          handlePerformSync();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, handlePerformSync]);

  const handleSessionSaved = () => {
    refreshOfflineCount();
  };

  const handleDataChanged = () => {
    setClasses(StorageService.getClasses());
    refreshOfflineCount();
  };

  const handleNavigateToAttendance = (classId: string, date: string) => {
    setInitialClassForAttendance(classId);
    setActiveTab('absensi');
  };

  const handleNavigateToReport = (classId: string) => {
    setInitialClassForReport(classId);
    setActiveTab('rekap');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col text-slate-800 pb-20 md:pb-8 selection:bg-emerald-800 selection:text-white">
      {/* PWA Offline Banner & Queue Notifier */}
      <OfflineIndicator
        isOnline={isOnline}
        simulatedOffline={simulatedOffline}
        toggleSimulateOffline={toggleSimulateOffline}
        pendingCount={pendingOfflineCount}
        onSync={handlePerformSync}
      />

      {/* Main School Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        isOnline={isOnline}
        simulatedOffline={simulatedOffline}
        onToggleSimulateOffline={toggleSimulateOffline}
        onOpenAuditLogs={() => setShowAuditLogs(true)}
        pendingSyncCount={pendingOfflineCount}
        onQuickSync={handlePerformSync}
      />

      {/* Desktop / Tablet Navigation Bar */}
      <div className="bg-white border-b border-slate-200 hidden md:block sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-1 sm:space-x-2 py-2">
              <button
                onClick={() => setActiveTab('absensi')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'absensi'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Pencatatan Absensi</span>
                {pendingOfflineCount > 0 && (
                  <span className="bg-amber-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {pendingOfflineCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('rekap')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'rekap'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Rekap & Laporan</span>
              </button>

              <button
                onClick={() => setActiveTab('manajemen')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'manajemen'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Data Sekolah & Siswa</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Monitoring Yayasan</span>
              </button>
            </nav>

            {/* Quick Sync Button in Desktop Bar if pending items exist */}
            {pendingOfflineCount > 0 && isOnline && (
              <button
                onClick={handlePerformSync}
                className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-amber-300"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sinkronkan {pendingOfflineCount} Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeTab === 'absensi' && (
          <AttendanceSheet
            currentUser={currentUser}
            classes={classes}
            isOnline={isOnline}
            onSessionSaved={handleSessionSaved}
            onOpenReport={handleNavigateToReport}
          />
        )}

        {activeTab === 'rekap' && (
          <ReportView
            classes={classes}
            initialClassId={initialClassForReport}
            onNavigateToAttendance={handleNavigateToAttendance}
          />
        )}

        {activeTab === 'manajemen' && (
          <SchoolManagement
            currentUser={currentUser}
            classes={classes}
            onDataChanged={handleDataChanged}
          />
        )}

        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            currentUser={currentUser}
            classes={classes}
            onNavigateToClass={handleNavigateToAttendance}
            onOpenAuditLogs={() => setShowAuditLogs(true)}
          />
        )}
      </main>

      {/* Footer info */}
      <footer className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 py-3 hidden md:block">
        <p>
          Sistem Absensi Siswa Berbasis PWA • Yayasan Harapan Ibu Kepri & SIT Insan Harapan Batam
        </p>
        <p className="text-[11px] text-slate-400/80 mt-0.5">
          Mendukung pencatatan offline, sinkronisasi otomatis, dan rekapitulasi kehadiran resmi
        </p>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        userRole={currentUser.role}
        pendingOfflineCount={pendingOfflineCount}
      />

      {/* Audit Log Modal */}
      {showAuditLogs && (
        <AuditLogModal onClose={() => setShowAuditLogs(false)} />
      )}

      {/* Global Toast */}
      {globalToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{globalToast.message}</span>
        </div>
      )}
    </div>
  );
}
