/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SchoolClass, Student, AttendanceSession, SchoolLevel } from '../../types';
import { StorageService } from '../../services/storageService';
import { PrintableReportModal } from './PrintableReportModal';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Printer, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
  Search
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  initialClassId?: string;
  onNavigateToAttendance: (classId: string, date: string) => void;
}

export const ReportView: React.FC<Props> = ({
  classes,
  initialClassId,
  onNavigateToAttendance,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialClassId || classes[0]?.id || 'sdit-1a'
  );

  // Date range presets
  const [periodPreset, setPeriodPreset] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(today);

  // Filter classes by level
  const filteredClasses = useMemo(() => {
    if (selectedLevel === 'ALL') return classes;
    return classes.filter(c => c.level === selectedLevel);
  }, [classes, selectedLevel]);

  // Selected Class details
  const currentClass = useMemo(() => {
    return classes.find(c => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Students of current class
  const classStudents = useMemo(() => {
    return StorageService.getStudentsByClass(selectedClassId);
  }, [selectedClassId]);

  // All Sessions
  const allSessions = useMemo(() => {
    return StorageService.getSessions();
  }, []);

  // Filter sessions by class and date range
  const matchedSessions = useMemo(() => {
    return allSessions.filter(s => {
      if (s.classId !== selectedClassId) return false;
      if (s.date < startDate || s.date > endDate) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [allSessions, selectedClassId, startDate, endDate]);

  // Printable modal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Handle Preset changes
  const handlePresetChange = (preset: 'today' | 'week' | 'month' | 'custom') => {
    setPeriodPreset(preset);
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    setEndDate(end);

    if (preset === 'today') {
      setStartDate(end);
    } else if (preset === 'week') {
      const past = new Date(Date.now() - 7 * 86400000);
      setStartDate(past.toISOString().split('T')[0]);
    } else if (preset === 'month') {
      const past = new Date(Date.now() - 30 * 86400000);
      setStartDate(past.toISOString().split('T')[0]);
    }
  };

  // Aggregates
  const stats = useMemo(() => {
    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlpa = 0;
    let totalEntries = 0;

    matchedSessions.forEach(sess => {
      totalHadir += sess.summary.hadir;
      totalSakit += sess.summary.sakit;
      totalIzin += sess.summary.izin;
      totalAlpa += sess.summary.alpa;
      totalEntries += sess.summary.total;
    });

    const averageRate = totalEntries > 0 ? Math.round((totalHadir / totalEntries) * 100) : 0;

    return {
      totalSessions: matchedSessions.length,
      totalHadir,
      totalSakit,
      totalIzin,
      totalAlpa,
      totalEntries,
      averageRate,
    };
  }, [matchedSessions]);

  // Export CSV
  const handleExportCsv = () => {
    if (classStudents.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Laporan Absensi Siswa - SIT Insan Harapan Batam\n`;
    csvContent += `Kelas: ${currentClass?.name} (${currentClass?.level})\n`;
    csvContent += `Periode: ${startDate} s/d ${endDate}\n`;
    csvContent += `Wali Kelas: ${currentClass?.homeroomTeacherName}\n\n`;
    csvContent += `No,NIS,Nama Lengkap,Gender,Hadir,Sakit,Izin,Alpa,Persentase Hadir\n`;

    classStudents.forEach((std, idx) => {
      let h = 0, s = 0, i = 0, a = 0;
      matchedSessions.forEach(sess => {
        const ent = sess.entries.find(e => e.studentId === std.id);
        if (ent) {
          if (ent.status === 'H') h++;
          else if (ent.status === 'S') s++;
          else if (ent.status === 'I') i++;
          else if (ent.status === 'A') a++;
        }
      });
      const tot = matchedSessions.length;
      const rate = tot > 0 ? Math.round((h / tot) * 100) : 100;
      csvContent += `${idx + 1},"${std.nis}","${std.name}",${std.gender},${h},${s},${i},${a},${rate}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Absensi_${currentClass?.name.replace(/\s+/g, '_')}_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <span>Rekapitulasi Kehadiran Siswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau laporan kehadiran per kelas, jenjang, dan periode sekolah
            </p>
          </div>

          {/* Quick Actions: Export & Print */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan Resmi</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Unit / Level */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Jenjang Sekolah
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                const nextClasses = e.target.value === 'ALL' ? classes : classes.filter(c => c.level === e.target.value);
                if (nextClasses[0]) setSelectedClassId(nextClasses[0].id);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="ALL">Semua Jenjang</option>
              <option value="RAIT">RAIT Insan Harapan</option>
              <option value="TKIT">TKIT Insan Harapan</option>
              <option value="SDIT">SDIT Insan Harapan</option>
              <option value="SMPIT">SMPIT Insan Harapan</option>
              <option value="SMAIT">SMAIT Insan Harapan</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pilih Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {filteredClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.level}] {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period Preset */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rentang Waktu
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handlePresetChange('today')}
                className={`py-1 rounded-lg text-center transition ${
                  periodPreset === 'today' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('week')}
                className={`py-1 rounded-lg text-center transition ${
                  periodPreset === 'week' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => handlePresetChange('month')}
                className={`py-1 rounded-lg text-center transition ${
                  periodPreset === 'month' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                30 Hari
              </button>
            </div>
          </div>

          {/* Custom Date Pickers */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Dari</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPeriodPreset('custom');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1 text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Sampai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPeriodPreset('custom');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Sesi Tercatat</p>
          <p className="text-xl font-black text-slate-900 mt-1">{stats.totalSessions} Sesi</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Di kelas {currentClass?.name}</p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-800 uppercase">Akumulasi Hadir</p>
          <p className="text-xl font-black text-emerald-900 mt-1">{stats.totalHadir}</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">Siswa hadir</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <p className="text-[11px] font-bold text-amber-800 uppercase">Sakit</p>
          <p className="text-xl font-black text-amber-900 mt-1">{stats.totalSakit}</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Dengan keterangan</p>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 shadow-xs">
          <p className="text-[11px] font-bold text-blue-800 uppercase">Izin</p>
          <p className="text-xl font-black text-blue-900 mt-1">{stats.totalIzin}</p>
          <p className="text-[10px] text-blue-700 mt-0.5">Izin terlampir</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-4 rounded-2xl text-white shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-emerald-200 uppercase">Rata-rata Kehadiran</p>
          <p className="text-xl font-black text-amber-400 mt-1">{stats.averageRate}%</p>
          <p className="text-[10px] text-emerald-300 mt-0.5">Target yayasan: &ge; 90%</p>
        </div>
      </div>

      {/* Sessions History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Riwayat Sesi Absensi ({matchedSessions.length} catatan)</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Klik sesi untuk melihat / mengedit detail
          </span>
        </div>

        {matchedSessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada sesi absensi pada rentang tanggal ini</p>
            <p className="text-xs text-slate-400 mt-1">
              Silakan catat absensi di menu utama atau ubah rentang filter tanggal.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {matchedSessions.map((sess) => {
              const formattedDate = new Date(sess.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={sess.id}
                  onClick={() => onNavigateToAttendance(sess.classId, sess.date)}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex flex-col items-center justify-center shrink-0">
                      <span>{sess.summary.attendanceRate}%</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {formattedDate}
                        </h4>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Sesi {sess.session}
                        </span>
                        {sess.syncStatus === 'offline_saved' && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                            Offline
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        Oleh: {sess.recordedByName} • Hadir: {sess.summary.hadir}/{sess.summary.total} • Sakit: {sess.summary.sakit} • Izin: {sess.summary.izin} • Alpa: {sess.summary.alpa}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">H: {sess.summary.hadir}</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">S: {sess.summary.sakit}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">I: {sess.summary.izin}</span>
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">A: {sess.summary.alpa}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Modal */}
      {showPrintModal && currentClass && (
        <PrintableReportModal
          selectedClass={currentClass}
          students={classStudents}
          sessions={matchedSessions}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setShowPrintModal(false)}
          onExportCsv={handleExportCsv}
        />
      )}
    </div>
  );
};
