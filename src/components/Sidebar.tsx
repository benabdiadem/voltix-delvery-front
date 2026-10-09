'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Bike,
  MapPin,
  Sliders,
  ShieldAlert,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Live Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Merchants', href: '/admin/merchants', icon: Store },
  { name: 'Products & Menus', href: '/admin/products', icon: UtensilsCrossed },
  { name: 'Couriers', href: '/admin/couriers', icon: Bike },
  { name: 'Campus Delivery Points', href: '/admin/delivery-points', icon: MapPin },
  { name: 'Settings', href: '/admin/settings', icon: Sliders },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
];

const publicLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Support', href: '/support' },
  { name: 'Delete Account', href: '/delete-account' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col min-h-screen border-r border-slate-800">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md">
          V
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight">Voltix Delivery</h1>
          <p className="text-xs text-green-400 font-medium">Admin Operations</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase px-3 py-2">Platform Management</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-5 text-[11px] font-semibold text-slate-400 uppercase px-3 py-2">Store Compliance Pages</div>
        {publicLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <span>{item.name}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center">
        Campus Multi-Shop V1.0
      </div>
    </aside>
  );
}

