import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-slate max-w-none bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Effective Date: October 7, 2026</p>

      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-900 text-sm font-semibold">
        Summary: Voltix Delivery strictly minimizes data collection. We do not use live GPS tracking or map SDKs. We only deliver to predefined campus collection spots. All payments are strictly Cash on Delivery (COD).
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">1. Information We Collect</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We collect only information necessary to operate campus food and goods deliveries in Algeria:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li><strong>Identity & Contact:</strong> Full name, Algerian mobile phone number (used for delivery call / SMS), and email address.</li>
          <li><strong>Order Details:</strong> Items requested from campus merchants, designated campus delivery point (e.g. Faculty Gate, Library Plaza), delivery notes, and 6-digit confirmation codes.</li>
          <li><strong>Courier Information:</strong> Student courier contact details, university affiliation, and delivery earnings records.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">2. Strict Zero-GPS & Location Data Policy</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Voltix Delivery does <strong>NOT</strong> request device location permissions (GPS, Fine/Coarse Location, or background location) from either customers or student couriers. Deliveries are coordinated exclusively via fixed, predefined campus delivery points (buildings, gates, faculties).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">3. How We Use Information</h2>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li>Facilitating orders between merchants, couriers, and clients on campus.</li>
          <li>Sending realtime status notifications and delivery confirmation codes.</li>
          <li>Preventing fraud and resolving delivery discrepancies.</li>
          <li>Calculating courier delivery compensation.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">4. Data Retention & Account Deletion</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Users have the right to request immediate deletion of their account and personal information at any time directly in the mobile application (under Profile → Settings → Delete Account) or online via our{' '}
          <a href="/delete-account" className="text-green-600 font-bold hover:underline">
            Data Deletion Page
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800">5. Contact Us</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          For questions regarding privacy, reach out to <span className="font-mono text-green-700">privacy@voltix.dz</span> or visit our <a href="/support" className="text-green-600 underline">Support Center</a>.
        </p>
      </section>
    </article>
  );
}

