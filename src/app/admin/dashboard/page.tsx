'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import {
  ShoppingBag,
  Clock,
  Bike,
  CheckCircle2,
  XCircle,
  Store,
  DollarSign,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['adminDashboardMetrics'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    },
    refetchInterval: 10000, // Live poll every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = data || {
    ordersToday: 0,
    waitingForCourier: 0,
    activeDeliveries: 0,
    deliveredToday: 0,
    cancelledToday: 0,
    couriers: { available: 0, busy: 0, totalActive: 0 },
    activeMerchants: 0,
    financialsToday: { productsTotalDzd: 0, deliveryFeesDzd: 0 },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Operational Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time status of university campus orders and fulfillment</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Critical Ops Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Waiting for Courier</p>
            <h3 className="text-2xl font-black text-amber-600">{metrics.waitingForCourier}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Unassigned campus orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Active Deliveries</p>
            <h3 className="text-2xl font-black text-blue-600">{metrics.activeDeliveries}</h3>
            <p className="text-xs text-slate-500 mt-0.5">In confirmation or transit</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Delivered Today</p>
            <h3 className="text-2xl font-black text-green-600">{metrics.deliveredToday}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Successfully handed over</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Cancelled Today</p>
            <h3 className="text-2xl font-black text-rose-600">{metrics.cancelledToday}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Total cancelled</p>
          </div>
        </div>
      </div>

      {/* Fleet & Platform Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Courier Fleet</span>
            <Bike className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{metrics.couriers.totalActive}</span>
            <span className="text-xs text-slate-500 font-medium">couriers on platform</span>
          </div>
          <div className="mt-3 flex items-center space-x-4 text-xs font-medium">
            <span className="text-green-600">● {metrics.couriers.available} Available</span>
            <span className="text-blue-600">● {metrics.couriers.busy} Busy</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Active Merchants</span>
            <Store className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{metrics.activeMerchants}</span>
            <span className="text-xs text-slate-500 font-medium">shops open on campus</span>
          </div>
          <Link href="/admin/merchants" className="mt-3 inline-block text-xs text-green-600 hover:underline font-semibold">
            Manage merchants →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Product Flow Today</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.financialsToday.productsTotalDzd.toLocaleString()} <span className="text-sm font-bold text-slate-500">DA</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Paid to merchant shops</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Courier Earnings Today</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-green-600">
            {metrics.financialsToday.deliveryFeesDzd.toLocaleString()} <span className="text-sm font-bold text-green-500">DA</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">100% credited to couriers</p>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Manage Live Campus Operations</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time status transitions, handle merchant unavailabilities, or intervene when necessary.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Inspect Live Orders
          </Link>
          <Link
            href="/admin/couriers"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-colors border border-slate-700"
          >
            Review Couriers
          </Link>
        </div>
      </div>
    </div>
  );
}

