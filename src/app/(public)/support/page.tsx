import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Support & Help Center</h1>
        <p className="text-sm text-slate-500">Need help with an order, shop, or courier delivery? We are here for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Email Inquiries</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Send our team an email regarding billing discrepancies, account issues, or partner merchant questions.
          </p>
          <a href="mailto:support@voltix.dz" className="text-sm font-bold text-green-600 hover:underline block">
            support@voltix.dz
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Urgent Delivery Hot-line</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Active order delayed or courier unable to meet at the campus delivery spot? Call our campus desk.
          </p>
          <div className="text-sm font-bold text-slate-900">
            +213 (0) 550 00 00 00
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Frequently Asked Questions</h2>
        <div className="space-y-4 text-sm divide-y divide-slate-100">
          <div className="pt-3">
            <h3 className="font-bold text-slate-800">How do multi-merchant orders work?</h3>
            <p className="text-xs text-slate-500 mt-1">
              You can add items from multiple campus stores to the same cart. A single assigned courier picks up items across all selected shops and delivers them to your selected campus drop point in one trip.
            </p>
          </div>

          <div className="pt-3">
            <h3 className="font-bold text-slate-800">What is the 6-digit delivery confirmation code?</h3>
            <p className="text-xs text-slate-500 mt-1">
              The code is displayed on your active order tracking screen in the mobile app. Only give it to the courier in person after verifying you have received all items.
            </p>
          </div>

          <div className="pt-3">
            <h3 className="font-bold text-slate-800">Can I pay online with credit card or EDAHABIA?</h3>
            <p className="text-xs text-slate-500 mt-1">
              In V1, Voltix Delivery operates exclusively on Cash on Delivery (COD) in Algerian Dinars (DZD) directly with the courier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

