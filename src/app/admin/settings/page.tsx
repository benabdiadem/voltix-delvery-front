'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Sliders, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [extraFee, setExtraFee] = useState('50');
  const [maxMerchants, setMaxMerchants] = useState('3');
  const [savedMessage, setSavedMessage] = useState(false);

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await api.get('/admin/settings');
      return res.data.data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return api.patch('/admin/settings', { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettingMutation.mutateAsync({
      key: 'multi_merchant_extra_fee_dzd',
      value: extraFee,
    });
    await updateSettingMutation.mutateAsync({
      key: 'max_merchants_per_order',
      value: maxMerchants,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System & Pricing Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure campus delivery fee algorithms and limits</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {savedMessage && (
          <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Settings saved and audit logged successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-sm">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Multi-Merchant Extra Fee (DA)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Fee added for each additional unique merchant in a multi-shop cart (Formula: Highest Base Fee + Extra Fee × (N - 1)).
            </p>
            <input
              type="number"
              value={extraFee}
              onChange={(e) => setExtraFee(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Maximum Merchants Per Order
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Operational cap to ensure courier fulfillment stays within realistic university delivery times.
            </p>
            <input
              type="number"
              value={maxMerchants}
              onChange={(e) => setMaxMerchants(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={updateSettingMutation.isPending}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

