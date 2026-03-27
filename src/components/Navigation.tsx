"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, TrendingUp, MessageCircle, BarChart3, Compass } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-gold flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">Future</span>
              <span className="gradient-text">Wealth</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/assess" icon={<MessageCircle className="w-4 h-4" />} label="Assessment" />
            <NavLink href="/dashboard" icon={<BarChart3 className="w-4 h-4" />} label="Dashboard" />
            <NavLink href="/future" icon={<Compass className="w-4 h-4" />} label="My Future" />
            <Link
              href="/assess"
              className="ml-4 px-5 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light text-white text-sm font-medium hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/5">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink href="/assess" label="Assessment" onClick={() => setOpen(false)} />
            <MobileNavLink href="/dashboard" label="Dashboard" onClick={() => setOpen(false)} />
            <MobileNavLink href="/future" label="My Future" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-surface-light transition-all duration-200"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-surface-light transition-colors"
    >
      {label}
    </Link>
  );
}
