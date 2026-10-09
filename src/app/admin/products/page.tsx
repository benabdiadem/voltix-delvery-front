'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { UtensilsCrossed, Plus, X } from 'lucide-react';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    merchantId: '',
    name: '',
    description: '',
    priceDzd: 200,
  });

  const { data: merchants = [] } = useQuery({
    queryKey: ['adminMerchantsList'],
    queryFn: async () => {
      const res = await api.get('/merchants');
      const data = res.data.data;
      if (data.length > 0 && !selectedMerchantId) {
        setSelectedMerchantId(data[0].id);
      }
      return data;
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['adminMerchantProducts', selectedMerchantId],
    queryFn: async () => {
      if (!selectedMerchantId) return [];
      const res = await api.get(`/merchants/${selectedMerchantId}/products`);
      return res.data.data;
    },
    enabled: !!selectedMerchantId,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      return api.post('/admin/products', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMerchantProducts', selectedMerchantId] });
      setShowAddModal(false);
      setFormData({
        merchantId: selectedMerchantId,
        name: '',
        description: '',
        priceDzd: 200,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`/admin/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMerchantProducts', selectedMerchantId] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products & Menus</h1>
          <p className="text-sm text-slate-500 mt-1">Manage food menus and grocery inventories across campus merchants</p>
        </div>
        <button
          onClick={() => {
            setFormData((f) => ({ ...f, merchantId: selectedMerchantId }));
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Merchant Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {merchants.map((m: any) => (
          <button
            key={m.id}
            onClick={() => setSelectedMerchantId(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedMerchantId === m.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No products found for this merchant.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Price (DZD)</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-xs">{p.description || '—'}</td>
                  <td className="px-6 py-4 font-black text-slate-900">{p.priceDzd} DA</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.isAvailable ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {p.isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: p.id,
                          data: { isAvailable: !p.isAvailable },
                        })
                      }
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                    >
                      {p.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-slate-900">Add Menu Item</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sandwich Escalope"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Avec frites et boisson"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Price (DA Integer)</label>
                <input
                  type="number"
                  required
                  value={formData.priceDzd}
                  onChange={(e) => setFormData({ ...formData, priceDzd: Number(e.target.value) })}
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
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

