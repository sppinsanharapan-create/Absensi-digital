/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AuditLogItem } from '../../types';
import { StorageService } from '../../services/storageService';
import { History, X, Search, ShieldCheck, Filter, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const AuditLogModal: React.FC<Props> = ({ onClose }) => {
  const [logs] = useState<AuditLogItem[]>(() => StorageService.getAuditLogs());
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterAction !== 'ALL' && log.action !== filterAction) return false;
      const matches = 
        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        (log.className && log.className.toLowerCase().includes(search.toLowerCase()));
      return matches;
    });
  }, [logs, filterAction, search]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Log Audit & Riwayat Perubahan</h3>
              <p className="text-[11px] text-emerald-300">
                Pemeriksaan administrasi Yayasan Harapan Ibu Kepri & SIT Insan Harapan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Action Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, kelas, atau aktivitas..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'create', 'update', 'sync', 'delete'].map((act) => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                  filterAction === act
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {act === 'ALL' ? 'Semua' : act}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada catatan audit yang sesuai dengan pencarian.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const formattedTime = new Date(log.timestamp).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={log.id} className="pt-2.5 first:pt-0 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          log.action === 'create'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'update'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'sync'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="font-bold text-slate-800">{log.actorName}</span>
                      <span className="text-[11px] text-slate-500">({log.actorRole})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {formattedTime}
                    </span>
                  </div>

                  <p className="text-slate-600 mt-1 pl-1 border-l-2 border-emerald-500/40 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Menampilkan {filteredLogs.length} entri audit</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
