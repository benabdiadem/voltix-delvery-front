'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { ShieldCheck, Search, Clock, FileText } from 'lucide-react';

interface AuditLog {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string | null;
  detailsJson: string | null;
  createdAt: string;
  adminUser?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ['adminAuditLogs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs');
      return res.data.data;
    },
    refetchInterval: 10000,
  });

  const filteredLogs = logs.filter((log) => {
    const query = searchTerm.toLowerCase();
    const actionMatch = log.action.toLowerCase().includes(query);
    const targetMatch = (log.targetType + ' ' + (log.targetId || '')).toLowerCase().includes(query);
    const userMatch = (log.adminUser?.firstName + ' ' + log.adminUser?.lastName + ' ' + log.adminUser?.email).toLowerCase().includes(query);
    return actionMatch || targetMatch || userMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Immutable administrative action trail for compliance and safety</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by action, admin, or target ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No audit logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {log.adminUser ? `${log.adminUser.firstName} ${log.adminUser.lastName}` : 'System'}
                      <div className="text-[10px] text-slate-400 font-normal">{log.adminUser?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-semibold">{log.targetType}</span>
                      {log.targetId && (
                        <span className="block font-mono text-[10px] text-slate-400 truncate max-w-xs">
                          {log.targetId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.detailsJson ? (
                        <pre className="text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-100 max-w-xs overflow-x-auto text-slate-600 font-mono">
                          {log.detailsJson}
                        </pre>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

