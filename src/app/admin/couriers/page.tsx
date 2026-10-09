'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Bike, Plus, ShieldCheck, ShieldAlert, Phone, Mail, X } from 'lucide-react';

export default function CouriersPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    studentId: '',
    isVerified: true,
  });

  const { data: couriers = [], isLoading } = useQuery({
    queryKey: ['adminCouriers'],
    queryFn: async () => {
      const res = await api.get('/admin/couriers');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      return api.post('/admin/couriers', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCouriers'] });
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        studentId: '',
        isVerified: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`/admin/couriers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCouriers'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Couriers & Delivery Fleet</h1>
          <p className="text-sm text-slate-500 mt-1">Verify student couriers, manage active status, and audit deliveries</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register Courier</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading couriers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Courier Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Reputation & Level</th>
                  <th className="px-6 py-4">Live Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {couriers.map((c: any) => {
                  const profile = c.courierProfile;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{c.firstName} {c.lastName}</div>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-slate-400">ID: {c.id.substring(0, 8)}...</span>
                          {c.studentId && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Matricule: {c.studentId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-0.5">
                        <div className="text-xs text-slate-800 font-semibold">{c.phone}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          {profile?.isVerified ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </span>
                          )}
                          {c.studentCardImageUrl && (
                            <span className="inline-flex items-center text-[10px] text-blue-600 font-medium">
                              ✓ Carte Étudiante
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-amber-500 font-extrabold text-sm flex items-center">
                            ★ {c.rating ? Number(c.rating).toFixed(1) : '5.0'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">({c.ratingsCount || 0} avis)</span>
                        </div>
                        <div className="mt-1 flex items-center space-x-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            ⚡ LVL {c.experiencePoints >= 1000 ? 5 : c.experiencePoints >= 600 ? 4 : c.experiencePoints >= 300 ? 3 : c.experiencePoints >= 100 ? 2 : 1}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500">{c.experiencePoints || 0} XP</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          profile?.availabilityStatus === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          profile?.availabilityStatus === 'BUSY' ? 'bg-blue-100 text-blue-800' :
                          profile?.availabilityStatus === 'SUSPENDED' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {profile?.availabilityStatus || 'OFFLINE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() =>
                            updateMutation.mutate({
                              id: c.id,
                              data: { isVerified: !profile?.isVerified },
                            })
                          }
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                        >
                          {profile?.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() =>
                            updateMutation.mutate({
                              id: c.id,
                              data: {
                                availabilityStatus:
                                  profile?.availabilityStatus === 'SUSPENDED'
                                    ? 'OFFLINE'
                                    : 'SUSPENDED',
                              },
                            })
                          }
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            profile?.availabilityStatus === 'SUSPENDED'
                              ? 'bg-green-100 hover:bg-green-200 text-green-800'
                              : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                          }`}
                        >
                          {profile?.availabilityStatus === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Courier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-slate-900">Register Campus Courier</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (Algerian)</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0550111222"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="courier@voltix.dz"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student ID (Matricule Universitaire)</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="Ex: 202431058921"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  Register Courier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

