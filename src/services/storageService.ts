/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolClass, Student, AttendanceSession, AuditLogItem, User } from '../types';
import { INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_USERS, getInitialAttendanceSessions, INITIAL_AUDIT_LOGS } from '../data/initialData';

const STORAGE_KEYS = {
  CLASSES: 'insanharapan_classes_v1',
  STUDENTS: 'insanharapan_students_v1',
  SESSIONS: 'insanharapan_sessions_v1',
  OFFLINE_QUEUE: 'insanharapan_offline_queue_v1',
  AUDIT_LOGS: 'insanharapan_audit_logs_v1',
  CURRENT_USER: 'insanharapan_current_user_v1',
};

// Safe localStorage helper
function getStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to parse ${key} from storage:`, err);
    return fallback;
  }
}

function setStoredJson<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Initialization
  init(): void {
    const existingClasses = getStoredJson<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
    const hasRait = existingClasses.some(c => c.level === 'RAIT');
    if (!localStorage.getItem(STORAGE_KEYS.CLASSES) || !hasRait) {
      setStoredJson(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
      setStoredJson(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      setStoredJson(STORAGE_KEYS.SESSIONS, getInitialAttendanceSessions());
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      setStoredJson(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      setStoredJson(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE)) {
      setStoredJson(STORAGE_KEYS.OFFLINE_QUEUE, []);
    }
  },

  // Users
  getUsers(): User[] {
    return INITIAL_USERS;
  },

  getCurrentUser(): User {
    this.init();
    return getStoredJson<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  setCurrentUser(user: User): void {
    setStoredJson(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Classes
  getClasses(): SchoolClass[] {
    this.init();
    return getStoredJson<SchoolClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },

  saveClasses(classes: SchoolClass[]): void {
    setStoredJson(STORAGE_KEYS.CLASSES, classes);
  },

  // Students
  getStudents(): Student[] {
    this.init();
    return getStoredJson<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },

  getStudentsByClass(classId: string): Student[] {
    const students = this.getStudents();
    return students.filter(s => s.classId === classId && s.status === 'active');
  },

  saveStudents(students: Student[]): void {
    setStoredJson(STORAGE_KEYS.STUDENTS, students);
  },

  addStudent(student: Omit<Student, 'id'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    students.push(newStudent);
    this.saveStudents(students);

    // Update class total
    this.recalculateClassTotals();
    return newStudent;
  },

  updateStudent(student: Student): void {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx !== -1) {
      students[idx] = student;
      this.saveStudents(students);
      this.recalculateClassTotals();
    }
  },

  deleteStudent(studentId: string): void {
    const students = this.getStudents().filter(s => s.id !== studentId);
    this.saveStudents(students);
    this.recalculateClassTotals();
  },

  recalculateClassTotals(): void {
    const classes = this.getClasses();
    const students = this.getStudents();
    const updated = classes.map(c => {
      const activeCount = students.filter(s => s.classId === c.id && s.status === 'active').length;
      return { ...c, totalStudents: activeCount };
    });
    this.saveClasses(updated);
  },

  // Attendance Sessions
  getSessions(): AttendanceSession[] {
    this.init();
    return getStoredJson<AttendanceSession[]>(STORAGE_KEYS.SESSIONS, []);
  },

  getSessionById(id: string): AttendanceSession | undefined {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id);
  },

  getSession(classId: string, date: string, session: string): AttendanceSession | undefined {
    const id = `${classId}_${date}_${session}`;
    return this.getSessionById(id);
  },

  saveAttendanceSession(
    sessionData: Omit<AttendanceSession, 'syncStatus' | 'updatedAt'> & { updatedAt?: string },
    isOnline: boolean,
    actor: User
  ): { session: AttendanceSession; isQueuedOffline: boolean } {
    this.init();
    const sessions = this.getSessions();
    const offlineQueue = this.getOfflineQueue();
    const now = new Date().toISOString();

    const syncStatus = isOnline ? 'synced' : 'offline_saved';
    const isOfflineCreated = !isOnline;

    const fullSession: AttendanceSession = {
      ...sessionData,
      updatedAt: now,
      syncStatus,
      isOfflineCreated,
    };

    // Deterministic deduplication
    const existingIndex = sessions.findIndex(s => s.id === fullSession.id);
    const isUpdate = existingIndex !== -1;

    if (isUpdate) {
      sessions[existingIndex] = fullSession;
    } else {
      sessions.unshift(fullSession);
    }
    setStoredJson(STORAGE_KEYS.SESSIONS, sessions);

    // If offline, manage queue
    if (!isOnline) {
      if (!offlineQueue.includes(fullSession.id)) {
        offlineQueue.push(fullSession.id);
        setStoredJson(STORAGE_KEYS.OFFLINE_QUEUE, offlineQueue);
      }
    } else {
      // Remove from offline queue if it was there
      const filteredQueue = offlineQueue.filter(id => id !== fullSession.id);
      setStoredJson(STORAGE_KEYS.OFFLINE_QUEUE, filteredQueue);
    }

    // Log Audit Trail
    const actionType = isUpdate ? 'update' : 'create';
    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.roleTitle || actor.role,
      action: actionType,
      details: `${isUpdate ? 'Memperbarui' : 'Mencatat'} absensi ${fullSession.className} (${fullSession.session}, ${fullSession.date}) - Hadir: ${fullSession.summary.hadir}, Sakit: ${fullSession.summary.sakit}, Izin: ${fullSession.summary.izin}, Alpa: ${fullSession.summary.alpa}. Status: ${isOnline ? 'Online tersinkron' : 'Disimpan lokal (Offline)'}`,
      classId: fullSession.classId,
      className: fullSession.className,
      date: fullSession.date,
    });

    return { session: fullSession, isQueuedOffline: !isOnline };
  },

  // Offline Queue
  getOfflineQueue(): string[] {
    this.init();
    return getStoredJson<string[]>(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },

  syncOfflineQueue(actor: User): { syncedCount: number; message: string } {
    this.init();
    const queue = this.getOfflineQueue();
    if (queue.length === 0) {
      return { syncedCount: 0, message: 'Semua data telah tersinkronisasi.' };
    }

    const sessions = this.getSessions();
    let updatedCount = 0;

    const updatedSessions = sessions.map(session => {
      if (queue.includes(session.id)) {
        updatedCount++;
        return {
          ...session,
          syncStatus: 'synced' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return session;
    });

    setStoredJson(STORAGE_KEYS.SESSIONS, updatedSessions);
    setStoredJson(STORAGE_KEYS.OFFLINE_QUEUE, []);

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.roleTitle || actor.role,
      action: 'sync',
      details: `Berhasil menyinkronkan ${updatedCount} catatan absensi offline ke server pusat SIT Insan Harapan Batam.`,
    });

    return {
      syncedCount: updatedCount,
      message: `${updatedCount} catatan absensi offline berhasil disinkronkan ke server pusat.`,
    };
  },

  // Audit Logs
  getAuditLogs(): AuditLogItem[] {
    this.init();
    return getStoredJson<AuditLogItem[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },

  addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLogItem = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) {
      logs.splice(200);
    }
    setStoredJson(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  // Reset to default sample
  resetToSampleData(): void {
    setStoredJson(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    setStoredJson(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    setStoredJson(STORAGE_KEYS.SESSIONS, getInitialAttendanceSessions());
    setStoredJson(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    setStoredJson(STORAGE_KEYS.OFFLINE_QUEUE, []);
  },
};
