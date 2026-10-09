'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Store, Plus, Phone, MapPin, Clock, DollarSign, X } from 'lucide-react';

export default function MerchantsPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'RESTAURANT',
    description: '',
    phone: '',
    addressText: '',
    baseDeliveryFeeDzd: 150,
    averagePreparationMinutes: 15,
  });

  const { data: merchants = [], isLoading } = useQuery({
    queryKey: ['adminMerchants'],
    queryFn: async () => {
      const res = await api.get('/merchants');
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      return api.post('/admin/merchants', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMerchants'] });
      setShowAddModal(false);
      setFormData({
        name: '',
        type: 'RESTAURANT',
        description: '',
        phone: '',
        addressText: '',
        baseDeliveryFeeDzd: 150,
        averagePreparationMinutes: 15,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`/admin/merchants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMerchants'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Merchants & Campus Shops</h1>
          <p className="text-sm text-slate-500 mt-1">Configure partner restaurants, cafes, alimentations, and base fees</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Merchant</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading merchants...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((m: any) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {m.type}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    !m.isTemporarilyUnavailable ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {!m.isTemporarilyUnavailable ? 'Open' : 'Unavailable'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4">{m.description || 'No description provided'}</p>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.addressText}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{m.averagePreparationMinutes} min preparation</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Base Delivery Fee</span>
                  <span className="font-black text-slate-900 text-sm">{m.baseDeliveryFeeDzd} DA</span>
                </div>

                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: m.id,
                      data: { isTemporarilyUnavailable: !m.isTemporarilyUnavailable },
                    })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {m.isTemporarilyUnavailable ? 'Set Open' : 'Set Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Merchant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-slate-900">Add New Campus Merchant</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Merchant Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Pizzeria Campus"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="RESTAURANT">RESTAURANT</option>
                    <option value="FAST_FOOD">FAST_FOOD</option>
                    <option value="COFFEE">COFFEE</option>
                    <option value="ALIMENTATION">ALIMENTATION</option>
                    <option value="BAKERY">BAKERY</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number (Courier Calls)</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="021xxxxxx"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pickup Address / Description</label>
                <input
                  type="text"
                  required
                  value={formData.addressText}
                  onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                  placeholder="e.g., Rue des Facultés, Local 4"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Delivery Fee (DA)</label>
                  <input
                    type="number"
                    required
                    value={formData.baseDeliveryFeeDzd}
                    onChange={(e) => setFormData({ ...formData, baseDeliveryFeeDzd: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Avg Prep Time (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={formData.averagePreparationMinutes}
                    onChange={(e) => setFormData({ ...formData, averagePreparationMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
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
                  Create Merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

