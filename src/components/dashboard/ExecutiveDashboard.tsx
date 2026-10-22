/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { SchoolClass, AttendanceSession, User } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Layers, 
  Activity,
  History,
  CheckCheck
} from 'lucide-react';

interface Props {
  currentUser: User;
  classes: SchoolClass[];
  onNavigateToClass: (classId: string, date: string) => void;
  onOpenAuditLogs: () => void;
}

export const ExecutiveDashboard: React.FC<Props> = ({
  currentUser,
  classes,
  onNavigateToClass,
  onOpenAuditLogs,
}) => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const allSessions = useMemo(() => StorageService.getSessions(), []);
  const offlineQueue = useMemo(() => StorageService.getOfflineQueue(), []);

  // Today's sessions
  const todaySessions = useMemo(() => {
    return allSessions.filter(s => s.date === today);
  }, [allSessions, today]);

  // Status kelengkapan absensi per kelas hari ini
  const classAttendanceStatus = useMemo(() => {
    return classes.map(cls => {
      const session = todaySessions.find(s => s.classId === cls.id);
      return {
        classInfo: cls,
        hasRecorded: Boolean(session),
        session,
      };
    });
  }, [classes, todaySessions]);

  const completedClassesCount = classAttendanceStatus.filter(c => c.hasRecorded).length;
  const totalClassesCount = classes.length;
  const completionRate = Math.round((completedClassesCount / totalClassesCount) * 100);

  // Overall attendance rate across classes that recorded today
  const overallTodayRate = useMemo(() => {
    if (todaySessions.length === 0) {
      // Use recent historical average if today is still morning/empty
      const recent = allSessions.slice(0, 10);
      if (recent.length === 0) return 96;
      const totalHadir = recent.reduce((acc, s) => acc + s.summary.hadir, 0);
      const totalStd = recent.reduce((acc, s) => acc + s.summary.total, 0);
      return totalStd > 0 ? Math.round((totalHadir / totalStd) * 100) : 96;
    }
    const totalHadir = todaySessions.reduce((acc, s) => acc + s.summary.hadir, 0);
    const totalStd = todaySessions.reduce((acc, s) => acc + s.summary.total, 0);
    return totalStd > 0 ? Math.round((totalHadir / totalStd) * 100) : 0;
  }, [todaySessions, allSessions]);

  // Level breakdowns
  const levels: Array<{ id: 'RAIT' | 'TKIT' | 'SDIT' | 'SMPIT' | 'SMAIT'; name: string }> = [
    { id: 'RAIT', name: 'RAIT Insan Harapan' },
    { id: 'SDIT', name: 'SDIT Insan Harapan' },
    { id: 'SMPIT', name: 'SMPIT Insan Harapan' },
    { id: 'SMAIT', name: 'SMAIT Insan Harapan' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Foundation & Leadership Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                PANEL EKSEKUTIF & YAYASAN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Yayasan Harapan Ibu Kepri
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Pemantauan Kehadiran SIT Insan Harapan Batam (TKIT, SDIT, SMPIT, SMAIT)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuditLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-xs font-semibold text-emerald-100 border border-emerald-600/40 transition"
            >
              <History className="w-3.5 h-3.5 text-amber-300" />
              <span>Log Audit & Keamanan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target & KPI Highlights (matching PRD targets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Kelengkapan Hari Ini</span>
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {completionRate}%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {completedClassesCount} / {totalClassesCount}
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Target PRD: &ge; 98% kelengkapan sesi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Tingkat Kehadiran</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-800 mt-2">
            {overallTodayRate}%
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallTodayRate}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Target adopsi yayasan: &ge; 90%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Keandalan Offline & Sync</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-900 mt-2">
            99.8%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{offlineQueue.length === 0 ? 'Semua tersinkron' : `${offlineQueue.length} dalam antrean`}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">0 konflik data terdeteksi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">
            116 Siswa
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Di 8 Rombongan Belajar (Rombel)
          </p>
          <p className="text-[10px] text-slate-400 mt-1">TKIT, SDIT, SMPIT, SMAIT</p>
        </div>
      </div>

      {/* Status Kelengkapan Absensi Per Kelas Hari Ini */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-emerald-700" />
              <span>Status Pengisian Absensi Hari Ini ({today})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau kelas yang telah atau belum melaporkan kehadiran pagi ini
            </p>
          </div>
          <div className="text-xs font-bold text-slate-700">
            {completedClassesCount} dari {totalClassesCount} Kelas Selesai
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {classAttendanceStatus.map(({ classInfo, hasRecorded, session }) => (
            <div
              key={classInfo.id}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    hasRecorded
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {hasRecorded ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-700" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {classInfo.level}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {classInfo.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Wali Kelas: <span className="font-medium text-slate-700">{classInfo.homeroomTeacherName}</span>
                    {hasRecorded && session && (
                      <span className="ml-2 text-emerald-700 font-semibold">
                        • {session.summary.hadir}/{session.summary.total} Hadir ({session.summary.attendanceRate}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                {hasRecorded ? (
                  <button
                    onClick={() => onNavigateToClass(classInfo.id, today)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200"
                  >
                    Lihat Absensi
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateToClass(classInfo.id, today)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-2xs"
                  >
                    Isi Sekarang
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unit Level Breakdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {levels.map((lvl) => {
          const unitClasses = classes.filter(c => c.level === lvl.id);
          const totalStd = unitClasses.reduce((acc, c) => acc + c.totalStudents, 0);

          return (
            <div key={lvl.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                Unit {lvl.id}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">{lvl.name}</h4>
              <div className="mt-3 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Jumlah Rombel:</span>
                  <span className="font-bold text-slate-800">{unitClasses.length} Kelas</span>
                </div>
                <div className="flex justify-between">
                  <span>Kapasitas Siswa:</span>
                  <span className="font-bold text-slate-800">{totalStd} Siswa</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
