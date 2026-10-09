import React from 'react';

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-slate max-w-none bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
      <p className="text-xs text-slate-400">Effective Date: October 7, 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">1. Acceptance of Terms</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          By downloading, accessing, or using Voltix Delivery, you agree to comply with and be bound by these Terms of Service. If you do not agree, do not use our services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">2. Service Description</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Voltix Delivery connects university students, staff, and faculty in Algeria with independent campus merchant shops and student couriers. Orders can bundle items from multiple merchants into a single synchronized delivery to designated campus points.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">3. Payment & Pricing Terms</h2>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li><strong>Payment Method:</strong> All transactions are conducted exclusively via Cash on Delivery (COD) in Algerian Dinars (DZD).</li>
          <li><strong>Exact Totals:</strong> Prices and fees are transparently displayed before checkout. The client agrees to pay the courier the exact total upon delivery.</li>
          <li><strong>Delivery Fee Formula:</strong> Multi-merchant delivery fee is calculated as: Highest Merchant Base Fee + (Extra Fee per additional shop × (N - 1)). In V1, 100% of the delivery fee is earned by the courier.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">4. Delivery & Confirmation Handover</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every client receives a secret 6-digit confirmation code in their application. When meeting the courier at the campus delivery point, the client provides this code to the courier to confirm physical handover. Orders cannot be marked completed without this verification code.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">5. User Conduct & Fair Use</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Fraudulent orders, abusive behavior towards merchants or couriers, or repeated no-shows at campus delivery points will result in immediate suspension or permanent termination of the account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">6. Governing Law</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          These terms are governed by the laws and regulations of the People’s Democratic Republic of Algeria.
        </p>
      </section>
    </article>
  );
}

