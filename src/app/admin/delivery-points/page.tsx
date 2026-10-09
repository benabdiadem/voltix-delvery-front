'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { MapPin, Plus, School, X } from 'lucide-react';

export default function DeliveryPointsPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    universityId: '',
    name: '',
    description: '',
    instructions: '',
  });

  const { data: points = [], isLoading } = useQuery({
    queryKey: ['adminDeliveryPoints'],
    queryFn: async () => {
      const res = await api.get('/delivery-points');
      return res.data.data;
    },
  });

  const { data: universities = [] } = useQuery({
    queryKey: ['adminUniversities'],
    queryFn: async () => {
      const res = await api.get('/universities');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      return api.post('/admin/delivery-points', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDeliveryPoints'] });
      setShowAddModal(false);
      setFormData({
        universityId: '',
        name: '',
        description: '',
        instructions: '',
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Delivery Points</h1>
          <p className="text-sm text-slate-500 mt-1">Predefined physical pickup spots on campus (No GPS / zero location permissions)</p>
        </div>
        <button
          onClick={() => {
            if (universities.length > 0) {
              setFormData((f) => ({ ...f, universityId: universities[0].id }));
            }
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Delivery Point</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-400 text-sm">Loading delivery points...</div>
        ) : points.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400">No delivery points registered yet.</div>
        ) : (
          points.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{p.university?.name}</p>
                </div>
                <div className="p-2 bg-green-50 text-green-700 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {p.faculty && (
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  {p.faculty.name}
                </div>
              )}

              {p.description && <p className="text-xs text-slate-600">{p.description}</p>}

              {p.instructions && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase mb-0.5">Fulfillment Notes:</span>
                  {p.instructions}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-slate-900">Add Predefined Delivery Point</h3>
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">University Campus</label>
                <select
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  required
                >
                  {universities.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Point Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Entrée Principale - Bloc C"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Zone centrale des amphis"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions for Courier & Client</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="e.g., Attendre près des distributeurs de boissons"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                  rows={2}
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
                  Create Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

