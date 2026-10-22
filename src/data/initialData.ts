/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolClass, Student, User, AttendanceSession, AuditLogItem, AttendanceEntry } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-guru-1',
    name: 'Ustadzah Fatimah Zahra, S.Pd.',
    role: 'guru',
    roleTitle: 'Wali Kelas 1 Abu Bakar (SDIT)',
    email: 'fatimah.zahra@insanharapan.sch.id',
    assignedClassIds: ['rait-a1', 'rait-b1', 'sdit-1a', 'sdit-1b'],
  },
  {
    id: 'user-guru-2',
    name: 'Ustadz Salman Al-Farisi, S.Pd.I.',
    role: 'guru',
    roleTitle: 'Wali Kelas 7 Al-Fatih (SMPIT)',
    email: 'salman.alfarisi@insanharapan.sch.id',
    assignedClassIds: ['smpit-7a', 'smait-10ipa'],
  },
  {
    id: 'user-staf-1',
    name: 'Ahmad Fauzi, S.Kom.',
    role: 'staf',
    roleTitle: 'Staf Administrasi & Tata Usaha',
    email: 'tatausaha@insanharapan.sch.id',
    assignedClassIds: ['tkit-a1', 'sdit-1a', 'sdit-1b', 'sdit-4a', 'smpit-7a', 'smpit-8a', 'smait-10ipa', 'smait-11ipa'],
  },
  {
    id: 'user-yayasan-1',
    name: 'Drs. H. Syarifuddin, M.M.',
    role: 'yayasan',
    roleTitle: 'Pimpinan Yayasan Harapan Ibu Kepri',
    email: 'pimpinan@yayasanharapanibu.org',
    assignedClassIds: ['tkit-a1', 'sdit-1a', 'sdit-1b', 'sdit-4a', 'smpit-7a', 'smpit-8a', 'smait-10ipa', 'smait-11ipa'],
  },
];

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'rait-a1',
    name: 'RA-A Khadijah',
    level: 'RAIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-1',
    homeroomTeacherName: 'Ustadzah Aminah, S.Pd.',
    totalStudents: 12,
  },
  {
    id: 'rait-b1',
    name: 'RA-B Aisyah',
    level: 'RAIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-1',
    homeroomTeacherName: 'Ustadzah Fatimah Zahra, S.Pd.',
    totalStudents: 12,
  },
  {
    id: 'sdit-1a',
    name: '1 Abu Bakar Ash-Shiddiq',
    level: 'SDIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-1',
    homeroomTeacherName: 'Ustadzah Fatimah Zahra, S.Pd.',
    totalStudents: 16,
  },
  {
    id: 'sdit-1b',
    name: '1 Umar Bin Khattab',
    level: 'SDIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-1',
    homeroomTeacherName: 'Ustadzah Maryam, S.Pd.',
    totalStudents: 16,
  },
  {
    id: 'sdit-4a',
    name: '4 Utsman Bin Affan',
    level: 'SDIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-2',
    homeroomTeacherName: 'Ustadz Zulkifli, S.Pd.I.',
    totalStudents: 15,
  },
  {
    id: 'smpit-7a',
    name: '7 Muhammad Al-Fatih',
    level: 'SMPIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-2',
    homeroomTeacherName: 'Ustadz Salman Al-Farisi, S.Pd.I.',
    totalStudents: 15,
  },
  {
    id: 'smpit-8a',
    name: '8 Shalahuddin Al-Ayyubi',
    level: 'SMPIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-2',
    homeroomTeacherName: 'Ustadzah Aisyah Putri, M.Pd.',
    totalStudents: 14,
  },
  {
    id: 'smait-10ipa',
    name: '10 Thariq Bin Ziyad',
    level: 'SMAIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-2',
    homeroomTeacherName: 'Ustadz Khalid, M.Sc.',
    totalStudents: 14,
  },
  {
    id: 'smait-11ipa',
    name: '11 Ibnu Sina',
    level: 'SMAIT',
    academicYear: '2026/2027',
    homeroomTeacherId: 'user-guru-2',
    homeroomTeacherName: 'Ustadzah dr. Nabilah, S.Ked.',
    totalStudents: 14,
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // RAIT Insan Harapan - RA-A Khadijah (rait-a1) - 12 students
  { id: 'std-ra-01', nis: '260001', nisn: '0185430001', name: 'Aisyah Humaira Azzahra', gender: 'P', classId: 'rait-a1', phoneParent: '081270010011', status: 'active' },
  { id: 'std-ra-02', nis: '260002', nisn: '0185430002', name: 'Ali bin Abi Thalib Kecil', gender: 'L', classId: 'rait-a1', phoneParent: '081372010022', status: 'active' },
  { id: 'std-ra-03', nis: '260003', nisn: '0185430003', name: 'Bilqis Queen Al-Kautsar', gender: 'P', classId: 'rait-a1', phoneParent: '082165010033', status: 'active' },
  { id: 'std-ra-04', nis: '260004', nisn: '0185430004', name: 'Dzakiandra Arkananta Batam', gender: 'L', classId: 'rait-a1', phoneParent: '085299010044', status: 'active' },
  { id: 'std-ra-05', nis: '260005', nisn: '0185430005', name: 'Hana Nafisah Syamil', gender: 'P', classId: 'rait-a1', phoneParent: '081377010055', status: 'active' },
  { id: 'std-ra-06', nis: '260006', nisn: '0185430006', name: 'Ilyas Al-Ghazi Pratama', gender: 'L', classId: 'rait-a1', phoneParent: '081266010066', status: 'active' },
  { id: 'std-ra-07', nis: '260007', nisn: '0185430007', name: 'Maryam Qanita Batam', gender: 'P', classId: 'rait-a1', phoneParent: '081923010077', status: 'active' },
  { id: 'std-ra-08', nis: '260008', nisn: '0185430008', name: 'Muhammad Bilal Al-Batawi', gender: 'L', classId: 'rait-a1', phoneParent: '085344010088', status: 'active' },
  { id: 'std-ra-09', nis: '260009', nisn: '0185430009', name: 'Rayyan Hamizan Putra', gender: 'L', classId: 'rait-a1', phoneParent: '081288010099', status: 'active' },
  { id: 'std-ra-10', nis: '260010', nisn: '0185430010', name: 'Safiyya Zahra An-Najwa', gender: 'P', classId: 'rait-a1', phoneParent: '082233010010', status: 'active' },
  { id: 'std-ra-11', nis: '260011', nisn: '0185430011', name: 'Umar Al-Faruq Kecil', gender: 'L', classId: 'rait-a1', phoneParent: '085211010011', status: 'active' },
  { id: 'std-ra-12', nis: '260012', nisn: '0185430012', name: 'Yusuf Habibi Firdaus', gender: 'L', classId: 'rait-a1', phoneParent: '081366010012', status: 'active' },

  // SDIT 1 Abu Bakar (sdit-1a) - 16 students
  { id: 'std-101', nis: '260101', nisn: '0165432101', name: 'Abdullah Azzam Ramadhan', gender: 'L', classId: 'sdit-1a', phoneParent: '081270112233', status: 'active' },
  { id: 'std-102', nis: '260102', nisn: '0165432102', name: 'Ahmad Bilal Al-Ghifari', gender: 'L', classId: 'sdit-1a', phoneParent: '081372889900', status: 'active' },
  { id: 'std-103', nis: '260103', nisn: '0165432103', name: 'Aisyah Putri Humaira', gender: 'P', classId: 'sdit-1a', phoneParent: '082165443322', status: 'active' },
  { id: 'std-104', nis: '260104', nisn: '0165432104', name: 'Alvaro Dzaky Al-Farabi', gender: 'L', classId: 'sdit-1a', phoneParent: '085299887766', status: 'active' },
  { id: 'std-105', nis: '260105', nisn: '0165432105', name: 'Aqila Shafa Zhafira', gender: 'P', classId: 'sdit-1a', phoneParent: '081377881122', status: 'active' },
  { id: 'std-106', nis: '260106', nisn: '0165432106', name: 'Fadhil Athallah Pratama', gender: 'L', classId: 'sdit-1a', phoneParent: '081266554433', status: 'active' },
  { id: 'std-107', nis: '260107', nisn: '0165432107', name: 'Fatimah Az-Zahra Batam', gender: 'P', classId: 'sdit-1a', phoneParent: '081923456789', status: 'active' },
  { id: 'std-108', nis: '260108', nisn: '0165432108', name: 'Habibi Rayhan Putra', gender: 'L', classId: 'sdit-1a', phoneParent: '085344332211', status: 'active' },
  { id: 'std-109', nis: '260109', nisn: '0165432109', name: 'Hafizhah Khairunisa', gender: 'P', classId: 'sdit-1a', phoneParent: '081288990011', status: 'active' },
  { id: 'std-110', nis: '260110', nisn: '0165432110', name: 'Ibrahim Khalilurrahman', gender: 'L', classId: 'sdit-1a', phoneParent: '082233445566', status: 'active' },
  { id: 'std-111', nis: '260111', nisn: '0165432111', name: 'Kayla Salsabila Medina', gender: 'P', classId: 'sdit-1a', phoneParent: '085211223344', status: 'active' },
  { id: 'std-112', nis: '260112', nisn: '0165432112', name: 'Muhammad Al-Fatih Batam', gender: 'L', classId: 'sdit-1a', phoneParent: '081366778899', status: 'active' },
  { id: 'std-113', nis: '260113', nisn: '0165432113', name: 'Naufal Dary Abiyyu', gender: 'L', classId: 'sdit-1a', phoneParent: '081299001122', status: 'active' },
  { id: 'std-114', nis: '260114', nisn: '0165432114', name: 'Rania Yasmin Syahirah', gender: 'P', classId: 'sdit-1a', phoneParent: '082345678901', status: 'active' },
  { id: 'std-115', nis: '260115', nisn: '0165432115', name: 'Syifa Nurul Izzati', gender: 'P', classId: 'sdit-1a', phoneParent: '081377441122', status: 'active' },
  { id: 'std-116', nis: '260116', nisn: '0165432116', name: 'Zaidan Zayan Al-Hakim', gender: 'L', classId: 'sdit-1a', phoneParent: '085288776655', status: 'active' },

  // SDIT 1 Umar (sdit-1b) - 16 students
  { id: 'std-121', nis: '260201', nisn: '0165432201', name: 'Adhwa Maryam Syafiqah', gender: 'P', classId: 'sdit-1b', phoneParent: '081270223344', status: 'active' },
  { id: 'std-122', nis: '260202', nisn: '0165432202', name: 'Affan Yusuf Maulana', gender: 'L', classId: 'sdit-1b', phoneParent: '081372990011', status: 'active' },
  { id: 'std-123', nis: '260203', nisn: '0165432203', name: 'Alifa Nuha Zahirah', gender: 'P', classId: 'sdit-1b', phoneParent: '082165554433', status: 'active' },
  { id: 'std-124', nis: '260204', nisn: '0165432204', name: 'Amru Bin Ash Pratama', gender: 'L', classId: 'sdit-1b', phoneParent: '085299008877', status: 'active' },
  { id: 'std-125', nis: '260205', nisn: '0165432205', name: 'Annisa Syakira Lathifah', gender: 'P', classId: 'sdit-1b', phoneParent: '081377992233', status: 'active' },
  { id: 'std-126', nis: '260206', nisn: '0165432206', name: 'Fariq Azhar Rabbani', gender: 'L', classId: 'sdit-1b', phoneParent: '081266665544', status: 'active' },
  { id: 'std-127', nis: '260207', nisn: '0165432207', name: 'Hana Khansa Talita', gender: 'P', classId: 'sdit-1b', phoneParent: '081923556780', status: 'active' },
  { id: 'std-128', nis: '260208', nisn: '0165432208', name: 'Ilyas Farhan Kamil', gender: 'L', classId: 'sdit-1b', phoneParent: '085344443322', status: 'active' },
  { id: 'std-129', nis: '260209', nisn: '0165432209', name: 'Jihan Nabila Mumtaz', gender: 'P', classId: 'sdit-1b', phoneParent: '081288001122', status: 'active' },
  { id: 'std-130', nis: '260210', nisn: '0165432210', name: 'Kenzo Rafisqy Al-Habsyi', gender: 'L', classId: 'sdit-1b', phoneParent: '082233556677', status: 'active' },
  { id: 'std-131', nis: '260211', nisn: '0165432211', name: 'Luthfi Hakim An-Nafis', gender: 'L', classId: 'sdit-1b', phoneParent: '085211334455', status: 'active' },
  { id: 'std-132', nis: '260212', nisn: '0165432212', name: 'Maryam Qonitah', gender: 'P', classId: 'sdit-1b', phoneParent: '081366889900', status: 'active' },
  { id: 'std-133', nis: '260213', nisn: '0165432213', name: 'Muhammad Raihan Rasyid', gender: 'L', classId: 'sdit-1b', phoneParent: '081299112233', status: 'active' },
  { id: 'std-134', nis: '260214', nisn: '0165432214', name: 'Salma Auliya Rahmah', gender: 'P', classId: 'sdit-1b', phoneParent: '082345778902', status: 'active' },
  { id: 'std-135', nis: '260215', nisn: '0165432215', name: 'Sulthan Ghani Firdaus', gender: 'L', classId: 'sdit-1b', phoneParent: '081377551122', status: 'active' },
  { id: 'std-136', nis: '260216', nisn: '0165432216', name: 'Zahra Fairuz Khalishah', gender: 'P', classId: 'sdit-1b', phoneParent: '085288887766', status: 'active' },

  // SMPIT 7 Al-Fatih (smpit-7a) - 15 students
  { id: 'std-701', nis: '240701', nisn: '0145432701', name: 'Abdurrahman Faiz Al-Banjari', gender: 'L', classId: 'smpit-7a', phoneParent: '081270554433', status: 'active' },
  { id: 'std-702', nis: '240702', nisn: '0145432702', name: 'Athiyyah Najla Hanifah', gender: 'P', classId: 'smpit-7a', phoneParent: '081372334455', status: 'active' },
  { id: 'std-703', nis: '240703', nisn: '0145432703', name: 'Danial Rafi Pramudya', gender: 'L', classId: 'smpit-7a', phoneParent: '082165778899', status: 'active' },
  { id: 'std-704', nis: '240704', nisn: '0145432704', name: 'Faza Muthi’ah Hasanah', gender: 'P', classId: 'smpit-7a', phoneParent: '085299443322', status: 'active' },
  { id: 'std-705', nis: '240705', nisn: '0145432705', name: 'Gibran Arkan Atharizz', gender: 'L', classId: 'smpit-7a', phoneParent: '081377119988', status: 'active' },
  { id: 'std-706', nis: '240706', nisn: '0145432706', name: 'Hilya Aulia Qanita', gender: 'P', classId: 'smpit-7a', phoneParent: '081266223344', status: 'active' },
  { id: 'std-707', nis: '240707', nisn: '0145432707', name: 'Khalid Basalamah Putra', gender: 'L', classId: 'smpit-7a', phoneParent: '081923667788', status: 'active' },
  { id: 'std-708', nis: '240708', nisn: '0145432708', name: 'Malika Zahra Al-Munawwar', gender: 'P', classId: 'smpit-7a', phoneParent: '085344556677', status: 'active' },
  { id: 'std-709', nis: '240709', nisn: '0145432709', name: 'Muhammad Ahsanul Fikri', gender: 'L', classId: 'smpit-7a', phoneParent: '081288223344', status: 'active' },
  { id: 'std-710', nis: '240710', nisn: '0145432710', name: 'Nadira Nur Syahidah', gender: 'P', classId: 'smpit-7a', phoneParent: '082233778899', status: 'active' },
  { id: 'std-711', nis: '240711', nisn: '0145432711', name: 'Raihan Dwi Saputra', gender: 'L', classId: 'smpit-7a', phoneParent: '085211556677', status: 'active' },
  { id: 'std-712', nis: '240712', nisn: '0145432712', name: 'Salwa Fauziyyah Rasyid', gender: 'P', classId: 'smpit-7a', phoneParent: '081366223344', status: 'active' },
  { id: 'std-713', nis: '240713', nisn: '0145432713', name: 'Syamil Basayev Nugroho', gender: 'L', classId: 'smpit-7a', phoneParent: '081299334455', status: 'active' },
  { id: 'std-714', nis: '240714', nisn: '0145432714', name: 'Yasmin Khadijah Safitri', gender: 'P', classId: 'smpit-7a', phoneParent: '082345889903', status: 'active' },
  { id: 'std-715', nis: '240715', nisn: '0145432715', name: 'Zaki Mubarak Kepri', gender: 'L', classId: 'smpit-7a', phoneParent: '081377662233', status: 'active' },

  // SMAIT 10 Thariq (smait-10ipa) - 14 students
  { id: 'std-1001', nis: '221001', nisn: '0125431001', name: 'Aditya Dimas Wardhana', gender: 'L', classId: 'smait-10ipa', phoneParent: '081270998877', status: 'active' },
  { id: 'std-1002', nis: '221002', nisn: '0125431002', name: 'Anisah Rahmawati Putri', gender: 'P', classId: 'smait-10ipa', phoneParent: '081372556677', status: 'active' },
  { id: 'std-1003', nis: '221003', nisn: '0125431003', name: 'Bagas Pratama Ansori', gender: 'L', classId: 'smait-10ipa', phoneParent: '082165990011', status: 'active' },
  { id: 'std-1004', nis: '221004', nisn: '0125431004', name: 'Dewi Sartika Batam', gender: 'P', classId: 'smait-10ipa', phoneParent: '085299665544', status: 'active' },
  { id: 'std-1005', nis: '221005', nisn: '0125431005', name: 'Farhan Maulana Al-Qudsi', gender: 'L', classId: 'smait-10ipa', phoneParent: '081377332211', status: 'active' },
  { id: 'std-1006', nis: '221006', nisn: '0125431006', name: 'Hasna Nabilah Robbani', gender: 'P', classId: 'smait-10ipa', phoneParent: '081266445566', status: 'active' },
  { id: 'std-1007', nis: '221007', nisn: '0125431007', name: 'Irfan Syakir Wicaksono', gender: 'L', classId: 'smait-10ipa', phoneParent: '081923889900', status: 'active' },
  { id: 'std-1008', nis: '221008', nisn: '0125431008', name: 'Marwah Syarifah Siregar', gender: 'P', classId: 'smait-10ipa', phoneParent: '085344778899', status: 'active' },
  { id: 'std-1009', nis: '221009', nisn: '0125431009', name: 'Muhammad Thariq Firdaus', gender: 'L', classId: 'smait-10ipa', phoneParent: '081288445566', status: 'active' },
  { id: 'std-1010', nis: '221010', nisn: '0125431010', name: 'Putri Balqis Al-Aydrus', gender: 'P', classId: 'smait-10ipa', phoneParent: '082233990011', status: 'active' },
  { id: 'std-1011', nis: '221011', nisn: '0125431011', name: 'Rifqi Abdillah Rabbani', gender: 'L', classId: 'smait-10ipa', phoneParent: '085211778899', status: 'active' },
  { id: 'std-1012', nis: '221012', nisn: '0125431012', name: 'Tasya Salsabila Mumtazah', gender: 'P', classId: 'smait-10ipa', phoneParent: '081366445566', status: 'active' },
  { id: 'std-1013', nis: '221013', nisn: '0125431013', name: 'Umar Farouq Al-Fadhil', gender: 'L', classId: 'smait-10ipa', phoneParent: '081299556677', status: 'active' },
  { id: 'std-1014', nis: '221014', nisn: '0125431014', name: 'Zahira Naura Putri', gender: 'P', classId: 'smait-10ipa', phoneParent: '082345990014', status: 'active' },
];

// Helper to generate realistic historical attendance sessions
export const getInitialAttendanceSessions = (): AttendanceSession[] => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

  const sessions: AttendanceSession[] = [];

  // Yesterday SDIT 1 Abu Bakar
  const sdit1aStudents = INITIAL_STUDENTS.filter(s => s.classId === 'sdit-1a');
  if (sdit1aStudents.length > 0) {
    const entriesYesterday: AttendanceEntry[] = sdit1aStudents.map((s, idx) => {
      let status: 'H' | 'S' | 'I' | 'A' = 'H';
      let note: string | undefined = undefined;
      if (idx === 3) {
        status = 'S';
        note = 'Demam & batuk, istirahat dokter';
      } else if (idx === 7) {
        status = 'I';
        note = 'Acara keluarga ke Tanjung Pinang';
      }
      return {
        studentId: s.id,
        studentName: s.name,
        nis: s.nis,
        gender: s.gender,
        status,
        note,
      };
    });

    const hadir = entriesYesterday.filter(e => e.status === 'H').length;
    const sakit = entriesYesterday.filter(e => e.status === 'S').length;
    const izin = entriesYesterday.filter(e => e.status === 'I').length;
    const alpa = entriesYesterday.filter(e => e.status === 'A').length;

    sessions.push({
      id: `sdit-1a_${yesterday}_Pagi`,
      classId: 'sdit-1a',
      className: '1 Abu Bakar Ash-Shiddiq',
      level: 'SDIT',
      date: yesterday,
      session: 'Pagi',
      recordedById: 'user-guru-1',
      recordedByName: 'Ustadzah Fatimah Zahra, S.Pd.',
      recordedAt: new Date(Date.now() - 86400000 + 7 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 + 7 * 3600000).toISOString(),
      syncStatus: 'synced',
      entries: entriesYesterday,
      summary: {
        total: entriesYesterday.length,
        hadir,
        sakit,
        izin,
        alpa,
        attendanceRate: Math.round((hadir / entriesYesterday.length) * 100),
      },
    });

    // 2 days ago SDIT 1 Abu Bakar
    const entriesTwoDaysAgo: AttendanceEntry[] = sdit1aStudents.map((s, idx) => {
      let status: 'H' | 'S' | 'I' | 'A' = 'H';
      let note: string | undefined = undefined;
      if (idx === 3) {
        status = 'S';
        note = 'Sakit demam';
      }
      return {
        studentId: s.id,
        studentName: s.name,
        nis: s.nis,
        gender: s.gender,
        status,
        note,
      };
    });

    sessions.push({
      id: `sdit-1a_${twoDaysAgo}_Pagi`,
      classId: 'sdit-1a',
      className: '1 Abu Bakar Ash-Shiddiq',
      level: 'SDIT',
      date: twoDaysAgo,
      session: 'Pagi',
      recordedById: 'user-guru-1',
      recordedByName: 'Ustadzah Fatimah Zahra, S.Pd.',
      recordedAt: new Date(Date.now() - 86400000 * 2 + 7 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2 + 7 * 3600000).toISOString(),
      syncStatus: 'synced',
      entries: entriesTwoDaysAgo,
      summary: {
        total: entriesTwoDaysAgo.length,
        hadir: entriesTwoDaysAgo.filter(e => e.status === 'H').length,
        sakit: 1,
        izin: 0,
        alpa: 0,
        attendanceRate: Math.round(((entriesTwoDaysAgo.length - 1) / entriesTwoDaysAgo.length) * 100),
      },
    });
  }

  // Yesterday SMPIT 7 Al-Fatih
  const smpit7aStudents = INITIAL_STUDENTS.filter(s => s.classId === 'smpit-7a');
  if (smpit7aStudents.length > 0) {
    const entriesSmpit: AttendanceEntry[] = smpit7aStudents.map((s, idx) => {
      let status: 'H' | 'S' | 'I' | 'A' = 'H';
      let note: string | undefined = undefined;
      if (idx === 5) {
        status = 'I';
        note = 'Izin menghadiri olimpiade sains Batam';
      } else if (idx === 10) {
        status = 'A';
        note = 'Tanpa surat keterangan';
      }
      return {
        studentId: s.id,
        studentName: s.name,
        nis: s.nis,
        gender: s.gender,
        status,
        note,
      };
    });

    const hadir = entriesSmpit.filter(e => e.status === 'H').length;
    const sakit = entriesSmpit.filter(e => e.status === 'S').length;
    const izin = entriesSmpit.filter(e => e.status === 'I').length;
    const alpa = entriesSmpit.filter(e => e.status === 'A').length;

    sessions.push({
      id: `smpit-7a_${yesterday}_Pagi`,
      classId: 'smpit-7a',
      className: '7 Muhammad Al-Fatih',
      level: 'SMPIT',
      date: yesterday,
      session: 'Pagi',
      recordedById: 'user-guru-2',
      recordedByName: 'Ustadz Salman Al-Farisi, S.Pd.I.',
      recordedAt: new Date(Date.now() - 86400000 + 7 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 + 7 * 3600000).toISOString(),
      syncStatus: 'synced',
      entries: entriesSmpit,
      summary: {
        total: entriesSmpit.length,
        hadir,
        sakit,
        izin,
        alpa,
        attendanceRate: Math.round((hadir / entriesSmpit.length) * 100),
      },
    });
  }

  return sessions;
};

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 86400000 + 7 * 3600000).toISOString(),
    actorId: 'user-guru-1',
    actorName: 'Ustadzah Fatimah Zahra, S.Pd.',
    actorRole: 'Guru',
    action: 'create',
    details: 'Mencatat absensi sesi Pagi Kelas 1 Abu Bakar Ash-Shiddiq (14 Hadir, 1 Sakit, 1 Izin)',
    classId: 'sdit-1a',
    className: '1 Abu Bakar Ash-Shiddiq',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 86400000 + 7.5 * 3600000).toISOString(),
    actorId: 'user-guru-2',
    actorName: 'Ustadz Salman Al-Farisi, S.Pd.I.',
    actorRole: 'Guru',
    action: 'create',
    details: 'Mencatat absensi sesi Pagi Kelas 7 Muhammad Al-Fatih (13 Hadir, 1 Izin, 1 Alpa)',
    classId: 'smpit-7a',
    className: '7 Muhammad Al-Fatih',
  },
];
