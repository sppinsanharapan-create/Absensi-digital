/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SchoolLevel = 'RAIT' | 'TKIT' | 'SDIT' | 'SMPIT' | 'SMAIT';

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa (Tanpa Keterangan)

export type UserRole = 'guru' | 'staf' | 'admin' | 'yayasan';

export type SessionType = 'Pagi' | 'Siang' | 'Harian';

export type SyncStatus = 'synced' | 'pending' | 'offline_saved';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  assignedClassIds: string[]; // Classes this user is directly responsible for
  avatarUrl?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  classId: string;
  phoneParent?: string;
  address?: string;
  status: 'active' | 'inactive';
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "1 Abu Bakar", "4 Umar", "7 Al-Fatih"
  level: SchoolLevel;
  academicYear: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  totalStudents: number;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  nis: string;
  gender: 'L' | 'P';
  status: AttendanceStatus;
  note?: string; // e.g. "Flu batuk", "Surat dokter", "Izin keluarga ke Karimun"
}

export interface AttendanceSession {
  id: string; // deterministic key: `${classId}_${date}_${session}`
  classId: string;
  className: string;
  level: SchoolLevel;
  date: string; // YYYY-MM-DD
  session: SessionType;
  recordedById: string;
  recordedByName: string;
  recordedAt: string; // ISO
  updatedAt: string;
  syncStatus: SyncStatus;
  isOfflineCreated?: boolean;
  entries: AttendanceEntry[];
  summary: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    attendanceRate: number; // 0 - 100 percentage
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: 'create' | 'update' | 'sync' | 'delete' | 'export';
  details: string;
  classId?: string;
  className?: string;
  date?: string;
}
