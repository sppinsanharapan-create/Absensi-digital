/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SchoolClass, Student, User } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Users, 
  School, 
  UserCheck, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface Props {
  currentUser: User;
  classes: SchoolClass[];
  onDataChanged: () => void;
}

export const SchoolManagement: React.FC<Props> = ({
  currentUser,
  classes,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'classes' | 'teachers'>('students');

  // Students state
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  // Student Modal (Add/Edit)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formNis, setFormNis] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formClassId, setFormClassId] = useState<string>(classes[0]?.id || 'sdit-1a');
  const [formPhone, setFormPhone] = useState('');

  // Classes state
  const [classesList, setClassesList] = useState<SchoolClass[]>(classes);

  const refreshData = () => {
    setStudents(StorageService.getStudents());
    setClassesList(StorageService.getClasses());
    onDataChanged();
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (selectedClassFilter !== 'ALL' && s.classId !== selectedClassFilter) return false;
      const matches = 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.nis.includes(studentSearch);
      return matches;
    });
  }, [students, selectedClassFilter, studentSearch]);

  const openAddStudentModal = () => {
    setEditingStudent(null);
    setFormName('');
    const randomNis = `26${Math.floor(1000 + Math.random() * 9000)}`;
    setFormNis(randomNis);
    setFormNisn(`016543${Math.floor(1000 + Math.random() * 9000)}`);
    setFormGender('L');
    setFormClassId(selectedClassFilter !== 'ALL' ? selectedClassFilter : classes[0]?.id || 'sdit-1a');
    setFormPhone('0812' + Math.floor(10000000 + Math.random() * 90000000));
    setIsAddStudentOpen(true);
  };

  const openEditStudentModal = (std: Student) => {
    setEditingStudent(std);
    setFormName(std.name);
    setFormNis(std.nis);
    setFormNisn(std.nisn);
    setFormGender(std.gender);
    setFormClassId(std.classId);
    setFormPhone(std.phoneParent || '');
    setIsAddStudentOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formNis.trim()) return;

    if (editingStudent) {
      StorageService.updateStudent({
        ...editingStudent,
        name: formName.trim(),
        nis: formNis.trim(),
        nisn: formNisn.trim(),
        gender: formGender,
        classId: formClassId,
        phoneParent: formPhone.trim(),
      });
      StorageService.addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.roleTitle,
        action: 'update',
        details: `Memperbarui data siswa: ${formName.trim()} (NIS: ${formNis.trim()})`,
        classId: formClassId,
      });
    } else {
      StorageService.addStudent({
        name: formName.trim(),
        nis: formNis.trim(),
        nisn: formNisn.trim(),
        gender: formGender,
        classId: formClassId,
        phoneParent: formPhone.trim(),
        status: 'active',
      });
      StorageService.addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.roleTitle,
        action: 'create',
        details: `Menambahkan siswa baru: ${formName.trim()} ke kelas ${classesList.find(c => c.id === formClassId)?.name}`,
        classId: formClassId,
      });
    }

    setIsAddStudentOpen(false);
    refreshData();
  };

  const handleDeleteStudent = (std: Student) => {
    if (confirm(`Apakah Anda yakin ingin menghapus siswa ${std.name}?`)) {
      StorageService.deleteStudent(std.id);
      StorageService.addAuditLog({
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.roleTitle,
        action: 'delete',
        details: `Menghapus data siswa: ${std.name} (NIS: ${std.nis})`,
        classId: std.classId,
      });
      refreshData();
    }
  };

  const handleResetData = () => {
    if (confirm('Kembalikan semua data ke setelan bawaan SIT Insan Harapan Batam? Catatan yang baru saja ditambahkan akan direset.')) {
      StorageService.resetToSampleData();
      refreshData();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-700" />
              <span>Pengelolaan Data Sekolah & Siswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola master data siswa, rombongan belajar (kelas), dan penugasan wali kelas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              title="Reset ke Data Bawaan"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Data Bawaan</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'students'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Data Siswa ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'classes'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Data Kelas ({classesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'teachers'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Penugasan Wali Kelas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DATA SISWA */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          {/* Controls: Search, Filter Class, Add Button */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Filter Class */}
              <div className="min-w-[180px]">
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="ALL">Semua Kelas ({students.length} Siswa)</option>
                  {classesList.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.level}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Cari siswa berdasarkan nama atau NIS..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            <button
              onClick={openAddStudentModal}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>
          </div>

          {/* Students List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">NIS / NISN</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">No. HP Orang Tua</th>
                    <th className="p-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Tidak ada data siswa yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((std, idx) => {
                      const cls = classesList.find(c => c.id === std.classId);
                      return (
                        <tr key={std.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center ${
                                std.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                              }`}>
                                {std.gender}
                              </span>
                              <span>{std.name}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            <div>{std.nis}</div>
                            <div className="text-[10px] text-slate-400">{std.nisn}</div>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800">
                              {cls ? `[${cls.level}] ${cls.name}` : '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            {std.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {std.phoneParent || '-'}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditStudentModal(std)}
                                title="Edit Siswa"
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(std)}
                                title="Hapus Siswa"
                                className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA KELAS */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {classesList.map((cls) => {
            const count = students.filter(s => s.classId === cls.id && s.status === 'active').length;
            return (
              <div
                key={cls.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                    {cls.level} Insan Harapan
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    TA {cls.academicYear}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {cls.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Wali Kelas: <strong className="text-slate-800">{cls.homeroomTeacherName}</strong>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Jumlah Siswa:</span>
                  <span className="font-bold bg-slate-100 text-slate-900 px-2 py-0.5 rounded-lg font-mono">
                    {count} Siswa Aktif
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: PENUGASAN WALI KELAS */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Penugasan Wali Kelas & Rombel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Guru hanya dapat mengisi absensi pada kelas yang ditugaskan kepada mereka
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {classesList.map((cls) => (
              <div key={cls.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {cls.level}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Kelas {cls.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Wali Kelas: <span className="font-semibold text-emerald-800">{cls.homeroomTeacherName}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {cls.academicYear}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT SISWA */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Muhammad Al-Fatih Batam"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIS *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNis}
                    onChange={(e) => setFormNis(e.target.value)}
                    placeholder="260101"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NISN
                  </label>
                  <input
                    type="text"
                    value={formNisn}
                    onChange={(e) => setFormNisn(e.target.value)}
                    placeholder="0165432101"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as 'L' | 'P')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kelas / Rombel *
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-semibold"
                  >
                    {classesList.map(c => (
                      <option key={c.id} value={c.id}>
                        [{c.level}] {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor HP Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="081270112233"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-xs"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
