/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AttendanceStatus } from '../../types';
import { MessageSquare, Check, X, FileText } from 'lucide-react';

interface Props {
  student: {
    id: string;
    nis: string;
    name: string;
    gender: 'L' | 'P';
  };
  index: number;
  currentStatus: AttendanceStatus;
  currentNote?: string;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onNoteChange: (studentId: string, note: string) => void;
}

export const StudentAttendanceCard: React.FC<Props> = ({
  student,
  index,
  currentStatus,
  currentNote = '',
  onStatusChange,
  onNoteChange,
}) => {
  const [showNoteInput, setShowNoteInput] = useState(Boolean(currentNote));
  const [tempNote, setTempNote] = useState(currentNote);

  const statusOptions: Array<{ key: AttendanceStatus; label: string; full: string; color: string; activeColor: string }> = [
    { key: 'H', label: 'H', full: 'Hadir', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100', activeColor: 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/40 font-bold' },
    { key: 'S', label: 'S', full: 'Sakit', color: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100', activeColor: 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/50 font-bold' },
    { key: 'I', label: 'I', full: 'Izin', color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100', activeColor: 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40 font-bold' },
    { key: 'A', label: 'A', full: 'Alpa', color: 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100', activeColor: 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/40 font-bold' },
  ];

  const handleStatusClick = (status: AttendanceStatus) => {
    onStatusChange(student.id, status);
    // If selecting Sakit or Izin, conveniently open note input if empty
    if ((status === 'S' || status === 'I') && !currentNote) {
      setShowNoteInput(true);
    }
  };

  const handleSaveNote = () => {
    onNoteChange(student.id, tempNote.trim());
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
        currentStatus === 'H'
          ? 'bg-white border-slate-200 hover:border-emerald-300'
          : currentStatus === 'S'
          ? 'bg-amber-50/40 border-amber-200'
          : currentStatus === 'I'
          ? 'bg-blue-50/40 border-blue-200'
          : 'bg-rose-50/40 border-rose-200'
      } shadow-xs hover:shadow-sm`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Student Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-7 text-xs font-mono font-bold text-slate-400 shrink-0">
            {index + 1}.
          </div>

          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
              student.gender === 'L'
                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                : 'bg-pink-100 text-pink-800 border border-pink-200'
            }`}
          >
            {student.gender === 'L' ? 'Ik' : 'Ak'}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {student.name}
              </h4>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                  student.gender === 'L'
                    ? 'bg-sky-50 text-sky-700 border border-sky-100'
                    : 'bg-pink-50 text-pink-700 border border-pink-100'
                }`}
              >
                {student.gender === 'L' ? 'L' : 'P'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              NIS: {student.nis}
            </p>
          </div>
        </div>

        {/* 1-Tap Attendance Status Buttons [H] [S] [I] [A] */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          {statusOptions.map((opt) => {
            const isSelected = currentStatus === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleStatusClick(opt.key)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center border transition-all active:scale-95 ${
                  isSelected ? opt.activeColor : opt.color
                }`}
                title={`${opt.full} (${opt.label})`}
              >
                {opt.label}
              </button>
            );
          })}

          {/* Quick Note Toggle */}
          <button
            type="button"
            onClick={() => setShowNoteInput(!showNoteInput)}
            title={currentNote ? `Catatan: ${currentNote}` : 'Tambah Catatan / Keterangan'}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition ml-1 ${
              currentNote
                ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inline Note Box */}
      {showNoteInput && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 animate-in fade-in">
          <div className="relative flex-1">
            <input
              type="text"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              onBlur={handleSaveNote}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveNote();
                }
              }}
              placeholder="Catatan kehadiran (cth: Demam, Surat Dokter, Izin keluarga)..."
              className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
            />
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <button
              type="button"
              onClick={handleSaveNote}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Simpan
            </button>
            {tempNote && (
              <button
                type="button"
                onClick={() => {
                  setTempNote('');
                  onNoteChange(student.id, '');
                }}
                className="px-2 py-1 text-xs text-slate-500 hover:text-rose-600 transition"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render Note preview if collapsed and note exists */}
      {!showNoteInput && currentNote && (
        <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center justify-between">
          <span className="truncate">
            <strong>Catatan:</strong> {currentNote}
          </span>
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-[10px] text-amber-900 underline ml-2 shrink-0 font-medium"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};
