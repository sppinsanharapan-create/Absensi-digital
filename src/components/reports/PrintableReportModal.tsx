/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolClass, Student, AttendanceSession } from '../../types';
import { Printer, Download, X } from 'lucide-react';

interface Props {
  selectedClass: SchoolClass;
  students: Student[];
  sessions: AttendanceSession[];
  startDate: string;
  endDate: string;
  onClose: () => void;
  onExportCsv: () => void;
}

export const PrintableReportModal: React.FC<Props> = ({
  selectedClass,
  students,
  sessions,
  startDate,
  endDate,
  onClose,
  onExportCsv,
}) => {
  // Aggregate stats per student across sessions in range
  const studentStats = students.map((std, idx) => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    sessions.forEach(sess => {
      const entry = sess.entries.find(e => e.studentId === std.id);
      if (entry) {
        if (entry.status === 'H') hadir++;
        else if (entry.status === 'S') sakit++;
        else if (entry.status === 'I') izin++;
        else if (entry.status === 'A') alpa++;
      }
    });

    const totalDays = sessions.length;
    const rate = totalDays > 0 ? Math.round((hadir / totalDays) * 100) : 100;

    return {
      index: idx + 1,
      student: std,
      hadir,
      sakit,
      izin,
      alpa,
      totalDays,
      rate,
    };
  });

  const totalHadirAll = studentStats.reduce((acc, s) => acc + s.hadir, 0);
  const totalSakitAll = studentStats.reduce((acc, s) => acc + s.sakit, 0);
  const totalIzinAll = studentStats.reduce((acc, s) => acc + s.izin, 0);
  const totalAlpaAll = studentStats.reduce((acc, s) => acc + s.alpa, 0);
  const totalMeetings = studentStats.reduce((acc, s) => acc + s.totalDays, 0);
  const overallRate = totalMeetings > 0 ? Math.round((totalHadirAll / totalMeetings) * 100) : 100;

  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Controls Toolbar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400">Pratinjau Cetak Dokumen Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-serif print:p-0 print:m-0 text-slate-900" id="print-area">
          {/* Kop Surat Resmi */}
          <div className="border-b-4 border-double border-emerald-900 pb-4 text-center relative mb-5">
            <div className="flex items-center justify-center gap-4 mb-1">
              <div className="w-14 h-14 rounded-full bg-emerald-900 text-amber-400 flex items-center justify-center font-bold text-xs p-1">
                <img src="/icon.svg" alt="Emblem" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 font-sans">
                  YAYASAN HARAPAN IBU KEPRI
                </h3>
                <h2 className="text-lg sm:text-xl font-extrabold uppercase text-emerald-900 font-sans tracking-tight">
                  SEKOLAH ISLAM TERPADU (SIT) INSAN HARAPAN BATAM
                </h2>
                <p className="text-xs text-slate-600 font-sans">
                  Jenjang: RAIT • SDIT • SMPIT • SMAIT Insan Harapan Batam
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Jl. Raja M. Tahir, Batam Kota, Batam, Kepulauan Riau • Telp: (0778) 461234
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-5 font-sans">
            <h4 className="text-base font-bold text-slate-900 uppercase underline decoration-2 underline-offset-4">
              REKAPITULASI KEHADIRAN SISWA
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Periode: {startDate} s/d {endDate} • Tahun Ajaran {selectedClass.academicYear}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-sans mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <p><span className="font-semibold text-slate-600">Unit Sekolah:</span> {selectedClass.level} Insan Harapan Batam</p>
              <p><span className="font-semibold text-slate-600">Kelas / Rombel:</span> {selectedClass.name}</p>
            </div>
            <div>
              <p><span className="font-semibold text-slate-600">Wali Kelas:</span> {selectedClass.homeroomTeacherName}</p>
              <p><span className="font-semibold text-slate-600">Total Sesi Tercatat:</span> {sessions.length} Hari/Sesi</p>
            </div>
          </div>

          {/* Attendance Table */}
          <table className="w-full text-xs border-collapse border border-slate-400 font-sans mb-6">
            <thead>
              <tr className="bg-emerald-900 text-white text-center">
                <th className="border border-slate-400 p-1.5 w-8">No</th>
                <th className="border border-slate-400 p-1.5 w-20">NIS</th>
                <th className="border border-slate-400 p-1.5 text-left">Nama Lengkap Siswa</th>
                <th className="border border-slate-400 p-1.5 w-10">L/P</th>
                <th className="border border-slate-400 p-1.5 w-12 bg-emerald-800">Hadir</th>
                <th className="border border-slate-400 p-1.5 w-12 bg-amber-700">Sakit</th>
                <th className="border border-slate-400 p-1.5 w-12 bg-blue-800">Izin</th>
                <th className="border border-slate-400 p-1.5 w-12 bg-rose-800">Alpa</th>
                <th className="border border-slate-400 p-1.5 w-16">% Hadir</th>
              </tr>
            </thead>
            <tbody>
              {studentStats.map((row) => (
                <tr key={row.student.id} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-1 text-center font-mono">{row.index}</td>
                  <td className="border border-slate-300 p-1 text-center font-mono">{row.student.nis}</td>
                  <td className="border border-slate-300 p-1 font-semibold">{row.student.name}</td>
                  <td className="border border-slate-300 p-1 text-center">{row.student.gender}</td>
                  <td className="border border-slate-300 p-1 text-center font-bold text-emerald-800">{row.hadir}</td>
                  <td className="border border-slate-300 p-1 text-center font-bold text-amber-700">{row.sakit}</td>
                  <td className="border border-slate-300 p-1 text-center font-bold text-blue-800">{row.izin}</td>
                  <td className="border border-slate-300 p-1 text-center font-bold text-rose-700">{row.alpa}</td>
                  <td className="border border-slate-300 p-1 text-center font-bold">{row.rate}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-center">
                <td colSpan={4} className="border border-slate-400 p-1.5 text-right pr-3">Total Akumulasi:</td>
                <td className="border border-slate-400 p-1.5 text-emerald-800">{totalHadirAll}</td>
                <td className="border border-slate-400 p-1.5 text-amber-700">{totalSakitAll}</td>
                <td className="border border-slate-400 p-1.5 text-blue-800">{totalIzinAll}</td>
                <td className="border border-slate-400 p-1.5 text-rose-700">{totalAlpaAll}</td>
                <td className="border border-slate-400 p-1.5 font-extrabold">{overallRate}%</td>
              </tr>
            </tfoot>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs font-sans mt-8 pt-4">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-bold text-slate-800 mt-1">Kepala Sekolah {selectedClass.level}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic">[Tanda Tangan & Cap Sekolah]</span>
              </div>
              <p className="font-bold underline text-slate-900">Ustadz H. Abdul Wahab, Lc., M.A.</p>
              <p className="text-[10px] text-slate-500">NIPY. 19820415 200801 1 002</p>
            </div>

            <div>
              <p className="text-slate-500">Batam, {todayFormatted}</p>
              <p className="font-bold text-slate-800 mt-1">Wali Kelas {selectedClass.name}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic">[Tanda Tangan Wali Kelas]</span>
              </div>
              <p className="font-bold underline text-slate-900">{selectedClass.homeroomTeacherName}</p>
              <p className="text-[10px] text-slate-500">NIPY. 19910820 201507 2 008</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
