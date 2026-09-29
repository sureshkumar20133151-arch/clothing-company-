"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "../../store/useAdminAuthStore";
import { User, LogOut, Shield, KeyRound, Sparkles } from "lucide-react";

export function AdminNavbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAdminAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">👑 Admin</span>;
      case "manager":
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">🏬 Manager</span>;
      case "support":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">🎧 Support</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Staff</span>;
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between text-white">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Pan-India Operations:</span>
        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Salem & Phulia Clusters Active
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {mounted && isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <User className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-400 block">{user.email}</span>
              </div>
              <div className="ml-2">{getRoleBadge(user.role)}</div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl transition"
          >
            Staff Login
          </Link>
        )}
      </div>
    </header>
  );
}
