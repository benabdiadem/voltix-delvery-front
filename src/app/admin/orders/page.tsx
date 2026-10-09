'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  User,
  Bike,
  Store,
  DollarSign,
  AlertCircle,
  X,
} from 'lucide-react';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeOrderModalId, setActiveOrderModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['adminOrders', selectedStatus],
    queryFn: async () => {
      const url = selectedStatus === 'ALL' ? '/admin/orders' : `/admin/orders?status=${selectedStatus}`;
      const res = await api.get(url);
      return res.data.data;
    },
    refetchInterval: 5000,
  });

  const { data: orderDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['adminOrderDetails', activeOrderModalId],
    queryFn: async () => {
      if (!activeOrderModalId) return null;
      const res = await api.get(`/admin/orders/${activeOrderModalId}`);
      return res.data.data;
    },
    enabled: !!activeOrderModalId,
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      return api.post(`/admin/orders/${orderId}/cancel`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrderDetails', activeOrderModalId] });
      setShowCancelPrompt(false);
      setCancelReason('');
    },
  });

  const releaseCourierMutation = useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      return api.post(`/admin/orders/${orderId}/release-courier`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrderDetails', activeOrderModalId] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_COURIER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Waiting Courier</span>;
      case 'COURIER_ACCEPTED':
      case 'CONFIRMING_MERCHANTS':
      case 'ADJUSTMENT_PENDING_CLIENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{status.replace(/_/g, ' ')}</span>;
      case 'MERCHANTS_CONFIRMED':
      case 'PICKING_UP':
      case 'ALL_PICKED_UP':
      case 'ON_THE_WAY':
      case 'ARRIVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">{status.replace(/_/g, ' ')}</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Delivered</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Live Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time lifecycle tracking & manual admin intervention</p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'WAITING_FOR_COURIER', 'COURIER_ACCEPTED', 'CONFIRMING_MERCHANTS', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-base font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">There are no orders matching this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Delivery Point</th>
                  <th className="px-6 py-4">Assigned Courier</th>
                  <th className="px-6 py-4">Shops</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">#{o.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{o.client?.firstName} {o.client?.lastName}</div>
                      <div className="text-xs text-slate-400">{o.client?.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      <div className="font-semibold text-slate-800">{o.deliveryPoint?.name}</div>
                      {o.blockName && (
                        <div className="text-xs text-amber-700 font-medium mt-0.5">
                          🚪 {o.blockName} • {o.floor} (Ch. {o.roomNumber})
                        </div>
                      )}
                      {o.studentActivity === 'STUDYING' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mt-1">
                          📚 Étudie
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {o.courier ? (
                        <div>
                          <span className="font-semibold text-slate-800">{o.courier.firstName} {o.courier.lastName}</span>
                          <p className="text-xs text-slate-400">{o.courier.phone}</p>
                        </div>
                      ) : (
                        <span className="text-xs italic text-amber-600 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-bold">
                        {o.merchantCount} shops
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {o.grandTotalDzd} <span className="text-xs font-normal text-slate-500">DA</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(o.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setActiveOrderModalId(o.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeOrderModalId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Order #{orderDetails?.orderNumber}
                </h3>
                {orderDetails && getStatusBadge(orderDetails.status)}
              </div>
              <button
                onClick={() => {
                  setActiveOrderModalId(null);
                  setShowCancelPrompt(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {detailsLoading || !orderDetails ? (
                <div className="text-center py-10 text-slate-400 text-sm">Loading order details...</div>
              ) : (
                <>
                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase flex items-center space-x-1.5 mb-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Client Info</span>
                      </p>
                      <p className="font-bold text-slate-900">{orderDetails.client?.firstName} {orderDetails.client?.lastName}</p>
                      <p className="text-xs text-slate-600">{orderDetails.client?.phone}</p>
                      <p className="text-xs text-slate-500">{orderDetails.client?.email}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase flex items-center space-x-1.5 mb-2">
                        <Bike className="w-3.5 h-3.5" />
                        <span>Courier Info</span>
                      </p>
                      {orderDetails.courier ? (
                        <>
                          <p className="font-bold text-slate-900">{orderDetails.courier?.firstName} {orderDetails.courier?.lastName}</p>
                          <p className="text-xs text-slate-600">{orderDetails.courier?.phone}</p>
                          <p className="text-xs text-slate-500">{orderDetails.courier?.email}</p>
                        </>
                      ) : (
                        <p className="text-xs italic text-amber-600 font-medium">Unassigned</p>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Delivery Destination</p>
                        {orderDetails.studentActivity === 'STUDYING' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            📚 Étudie (Discrétion)
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900">{orderDetails.deliveryPoint?.name}</p>
                      <p className="text-xs text-slate-600">{orderDetails.deliveryPoint?.university?.name} • {orderDetails.deliveryPoint?.faculty?.name}</p>
                      
                      {orderDetails.blockName && (
                        <div className="mt-2.5 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                          <p className="font-bold text-amber-900">
                            🚪 {orderDetails.blockName} • {orderDetails.floor} • Chambre N° {orderDetails.roomNumber}
                          </p>
                          {orderDetails.clientNote && (
                            <p className="text-[11px] text-amber-800 mt-1 italic">
                              Instructions: &ldquo;{orderDetails.clientNote}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                      {orderDetails.deliveryPoint?.instructions && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          &ldquo;{orderDetails.deliveryPoint.instructions}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-4 bg-green-50/60 rounded-2xl border border-green-200">
                    <h4 className="text-xs font-bold text-green-900 uppercase tracking-wide mb-3">
                      Authoritative Financial Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-slate-500">Products Subtotal:</span>
                        <p className="font-bold text-slate-900">{orderDetails.productsTotalDzd} DA</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Delivery Fee (Courier Earning):</span>
                        <p className="font-bold text-green-700">{orderDetails.deliveryFeeDzd} DA</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Client Cash Due:</span>
                        <p className="font-black text-slate-900 text-base">{orderDetails.grandTotalDzd} DA</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Platform Share (V1):</span>
                        <p className="font-bold text-slate-500">0 DA</p>
                      </div>
                    </div>
                  </div>

                  {/* Merchants & Items Grouping */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center space-x-2">
                      <Store className="w-4 h-4 text-slate-500" />
                      <span>Order Merchants & Items Breakdown</span>
                    </h4>
                    <div className="space-y-3">
                      {orderDetails.merchants?.map((m: any) => (
                        <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                            <div>
                              <span className="font-bold text-sm text-slate-900">{m.merchantNameSnapshot}</span>
                              <span className="ml-2 text-xs text-slate-400">({m.merchantTypeSnapshot})</span>
                              <p className="text-xs text-slate-500">{m.merchantAddressSnapshot} • Phone: {m.merchantPhoneSnapshot}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                m.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                m.status === 'PICKED_UP' ? 'bg-indigo-100 text-indigo-800' :
                                m.status === 'ISSUE' ? 'bg-amber-100 text-amber-800' :
                                m.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {m.status}
                              </span>
                              <p className="text-xs text-slate-400 mt-1">Base fee: {m.baseDeliveryFeeSnapshotDzd} DA</p>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {m.items?.map((it: any) => (
                              <div key={it.id} className="flex justify-between text-xs text-slate-700">
                                <span>{it.quantity}x {it.productNameSnapshot}</span>
                                <span className="font-semibold text-slate-900">{it.lineTotalDzd} DA</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Manual Intervention Actions */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Manual Admin Interventions</h4>
                    <div className="flex flex-wrap items-center gap-3">
                      {orderDetails.status !== 'DELIVERED' && orderDetails.status !== 'CANCELLED' && (
                        <>
                          <button
                            onClick={() => setShowCancelPrompt(true)}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                          >
                            Cancel Order with Reason
                          </button>

                          {orderDetails.courier && orderDetails.status !== 'MERCHANTS_CONFIRMED' && (
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to release this courier from the order?')) {
                                  releaseCourierMutation.mutate({
                                    orderId: orderDetails.id,
                                    reason: 'Admin manual re-dispatch',
                                  });
                                }
                              }}
                              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-sm"
                            >
                              Release Courier to Available Pool
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {showCancelPrompt && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-rose-200 space-y-3">
                        <label className="block text-xs font-bold text-slate-700">Mandatory Cancellation Reason (Audit Logged):</label>
                        <input
                          type="text"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="e.g., Client requested cancellation due to campus closure"
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg text-slate-800"
                        />
                        <div className="flex space-x-2">
                          <button
                            disabled={!cancelReason.trim() || cancelMutation.isPending}
                            onClick={() => cancelMutation.mutate({ orderId: orderDetails.id, reason: cancelReason })}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                          >
                            Confirm Cancellation
                          </button>
                          <button
                            onClick={() => setShowCancelPrompt(false)}
                            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

