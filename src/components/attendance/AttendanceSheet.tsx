/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SchoolClass, Student, AttendanceStatus, AttendanceSession, User, SessionType } from '../../types';
import { StorageService } from '../../services/storageService';
import { StudentAttendanceCard } from './StudentAttendanceCard';
import { 
  Calendar, 
  Clock, 
  CheckCheck, 
  Save, 
  CloudCheck, 
  CloudOff, 
  Filter, 
  Search,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Users
} from 'lucide-react';

interface Props {
  currentUser: User;
  classes: SchoolClass[];
  isOnline: boolean;
  onSessionSaved: () => void;
  onOpenReport: (classId: string) => void;
}

export const AttendanceSheet: React.FC<Props> = ({
  currentUser,
  classes,
  isOnline,
  onSessionSaved,
  onOpenReport,
}) => {
  // Determine available classes based on user role
  const availableClasses = useMemo(() => {
    if (currentUser.role === 'guru') {
      const filtered = classes.filter(c => currentUser.assignedClassIds.includes(c.id));
      return filtered.length > 0 ? filtered : classes;
    }
    return classes;
  }, [classes, currentUser]);

  // Selected State
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    return availableClasses[0]?.id || 'rait-a1';
  });

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSession, setSelectedSession] = useState<SessionType>('Pagi');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | AttendanceStatus>('ALL');

  // Attendance Map: studentId -> status & notes
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [existingSession, setExistingSession] = useState<AttendanceSession | null>(null);

  // UI status feedback
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'offline' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load students for current class
  const classStudents = useMemo(() => {
    return StorageService.getStudentsByClass(selectedClassId);
  }, [selectedClassId]);

  const selectedClass = useMemo(() => {
    return classes.find(c => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Load or initialize attendance record whenever class, date, or session changes
  useEffect(() => {
    const session = StorageService.getSession(selectedClassId, selectedDate, selectedSession);
    if (session) {
      setExistingSession(session);
      const newMap: Record<string, { status: AttendanceStatus; note: string }> = {};
      session.entries.forEach(e => {
        newMap[e.studentId] = { status: e.status, note: e.note || '' };
      });
      // Fill any newly added students as Hadir by default
      classStudents.forEach(s => {
        if (!newMap[s.id]) {
          newMap[s.id] = { status: 'H', note: '' };
        }
      });
      setAttendanceMap(newMap);
    } else {
      setExistingSession(null);
      // Default all to 'H' (Hadir)
      const defaultMap: Record<string, { status: AttendanceStatus; note: string }> = {};
      classStudents.forEach(s => {
        defaultMap[s.id] = { status: 'H', note: '' };
      });
      setAttendanceMap(defaultMap);
    }
  }, [selectedClassId, selectedDate, selectedSession, classStudents]);

  // Bulk actions
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      updated[s.id] = { status: 'H', note: '' };
    });
    setAttendanceMap(updated);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        status,
        note: prev[studentId]?.note || '',
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'H',
        note,
      },
    }));
  };

  // Real-time calculation of statistics
  const summary = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    classStudents.forEach(s => {
      const entry = attendanceMap[s.id];
      const status = entry?.status || 'H';
      if (status === 'H') hadir++;
      else if (status === 'S') sakit++;
      else if (status === 'I') izin++;
      else if (status === 'A') alpa++;
    });

    const total = classStudents.length;
    const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return { total, hadir, sakit, izin, alpa, rate };
  }, [classStudents, attendanceMap]);

  // Filter students based on search and status filter
  const filteredStudents = useMemo(() => {
    return classStudents.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.includes(searchQuery);

      if (!matchesSearch) return false;

      if (filterStatus === 'ALL') return true;
      const status = attendanceMap[student.id]?.status || 'H';
      return status === filterStatus;
    });
  }, [classStudents, searchQuery, filterStatus, attendanceMap]);

  // Save attendance session
  const handleSaveAttendance = () => {
    if (classStudents.length === 0) return;
    setIsSubmitting(true);

    try {
      const entries = classStudents.map(s => {
        const item = attendanceMap[s.id] || { status: 'H', note: '' };
        return {
          studentId: s.id,
          studentName: s.name,
          nis: s.nis,
          gender: s.gender,
          status: item.status,
          note: item.note,
        };
      });

      const sessionId = `${selectedClassId}_${selectedDate}_${selectedSession}`;
      const sessionData: Omit<AttendanceSession, 'syncStatus' | 'updatedAt'> = {
        id: sessionId,
        classId: selectedClassId,
        className: selectedClass?.name || 'Kelas',
        level: selectedClass?.level || 'SDIT',
        date: selectedDate,
        session: selectedSession,
        recordedById: currentUser.id,
        recordedByName: currentUser.name,
        recordedAt: existingSession?.recordedAt || new Date().toISOString(),
        entries,
        summary: {
          total: summary.total,
          hadir: summary.hadir,
          sakit: summary.sakit,
          izin: summary.izin,
          alpa: summary.alpa,
          attendanceRate: summary.rate,
        },
      };

      const result = StorageService.saveAttendanceSession(sessionData, isOnline, currentUser);
      setExistingSession(result.session);
      onSessionSaved();

      if (result.isQueuedOffline) {
        setSaveMessage({
          type: 'offline',
          text: 'Tersimpan di perangkat lokal (Mode Offline). Data akan disinkronkan otomatis saat terhubung internet.',
        });
      } else {
        setSaveMessage({
          type: 'success',
          text: 'Data absensi berhasil disimpan & tersinkronisasi ke server SIT Insan Harapan Batam.',
        });
      }

      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } catch (err) {
      console.error(err);
      setSaveMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat menyimpan data absensi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Breadcrumb & Class Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                {selectedClass?.level || 'SDIT'}
              </span>
              <span>•</span>
              <span className="text-slate-500">Tahun Ajaran {selectedClass?.academicYear || '2026/2027'}</span>
              <span>•</span>
              <span className="text-slate-600">Wali: {selectedClass?.homeroomTeacherName}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center flex-wrap gap-2">
              <span className="text-emerald-950 font-bold">Absensi Siswa SIT Insan Harapan</span>
              {selectedClass && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {selectedClass.name}
                </span>
              )}
            </h2>
          </div>

          {/* Controls: Class, Date, Session */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Class Dropdown */}
            <div className="min-w-[170px] flex-1 sm:flex-initial">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Pilih Kelas
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              >
                {availableClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.level}] {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="min-w-[140px] flex-1 sm:flex-initial">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tanggal Absensi
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Session Type */}
            <div className="min-w-[110px]">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sesi
              </label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value as SessionType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Pagi">Pagi</option>
                <option value="Siang">Siang</option>
                <option value="Harian">Harian</option>
              </select>
            </div>
          </div>
        </div>

        {/* Existing Session Sync Status Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {existingSession ? (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold ${
                existingSession.syncStatus === 'synced'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-300'
              }`}>
                {existingSession.syncStatus === 'synced' ? (
                  <>
                    <CloudCheck className="w-4 h-4 text-emerald-600" />
                    <span>Tersimpan & Tersinkronisasi</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-4 h-4 text-amber-600" />
                    <span>Tersimpan Lokal (Menunggu Sinkronisasi)</span>
                  </>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Sesi ini belum dicatat</span>
              </span>
            )}

            {existingSession && (
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                Dicatat oleh {existingSession.recordedByName} ({new Date(existingSession.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
          </div>

          <button
            onClick={() => onOpenReport(selectedClassId)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Lihat Rekap Kelas Ini</span>
          </button>
        </div>
      </div>

      {/* Real-time Summary Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Siswa</p>
            <p className="text-lg font-black text-slate-800">{summary.total}</p>
          </div>
        </div>

        <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
            H
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 uppercase">Hadir</p>
            <p className="text-lg font-black text-emerald-900">{summary.hadir}</p>
          </div>
        </div>

        <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
            S
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-800 uppercase">Sakit</p>
            <p className="text-lg font-black text-amber-900">{summary.sakit}</p>
          </div>
        </div>

        <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
            I
          </div>
          <div>
            <p className="text-[11px] font-semibold text-blue-800 uppercase">Izin</p>
            <p className="text-lg font-black text-blue-900">{summary.izin}</p>
          </div>
        </div>

        <div className="bg-rose-50/80 p-3 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
            A
          </div>
          <div>
            <p className="text-[11px] font-semibold text-rose-800 uppercase">Alpa</p>
            <p className="text-lg font-black text-rose-900">{summary.alpa}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-3 rounded-2xl border border-emerald-800 text-white shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-extrabold text-xs shrink-0">
            %
          </div>
          <div>
            <p className="text-[11px] font-medium text-emerald-200 uppercase">Kehadiran</p>
            <p className="text-lg font-black text-white">{summary.rate}%</p>
          </div>
        </div>
      </div>

      {/* Save Notification Alert */}
      {saveMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border shadow-sm animate-in fade-in ${
            saveMessage.type === 'offline'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          {saveMessage.type === 'offline' ? (
            <CloudOff className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Action Toolbar: Quick Mark All Hadir, Search, Filter */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1-Tap Mark All Present */}
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Tandai Semua Hadir</span>
          </button>

          {/* Filter Status buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
            {(['ALL', 'H', 'S', 'I', 'A'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'Semua' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Student */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama / NIS siswa..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="space-y-2.5">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada siswa ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              Periksa pencarian atau filter status kehadiran.
            </p>
          </div>
        ) : (
          filteredStudents.map((student, idx) => (
            <StudentAttendanceCard
              key={student.id}
              student={student}
              index={idx}
              currentStatus={attendanceMap[student.id]?.status || 'H'}
              currentNote={attendanceMap[student.id]?.note || ''}
              onStatusChange={handleStatusChange}
              onNoteChange={handleNoteChange}
            />
          ))
        )}
      </div>

      {/* Sticky Bottom Save Action Bar */}
      <div className="sticky bottom-16 md:bottom-4 z-20 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
        <div className="text-xs">
          <p className="font-bold text-slate-900">
            {summary.hadir} Hadir • {summary.sakit + summary.izin + summary.alpa} Tidak Hadir
          </p>
          <p className="text-[11px] text-slate-500">
            {isOnline ? 'Terhubung ke Server Batam' : 'Mode Offline — Disimpan di memori perangkat'}
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={isSubmitting || classStudents.length === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition active:scale-95 ${
            isOnline
              ? 'bg-emerald-700 hover:bg-emerald-800'
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {isSubmitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : isOnline ? (
            <Save className="w-4 h-4" />
          ) : (
            <CloudOff className="w-4 h-4" />
          )}
          <span>{isOnline ? 'Simpan Absensi' : 'Simpan Offline'}</span>
        </button>
      </div>
    </div>
  );
};
