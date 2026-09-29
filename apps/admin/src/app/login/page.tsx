"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "../../store/useAdminAuthStore";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, Sparkles, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAdminAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.push("/");
    } catch {
      // Error handled in store
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    clearError();
  };

  return (
    <div className="max-w-md mx-auto py-16 sm:py-24">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl text-left">
        <div className="text-center mb-6">
          <span className="text-2xl font-serif font-bold text-amber-400 tracking-wider">
            INDIGO & THREAD
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold uppercase tracking-wider mt-2 border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Staff & Logistics Portal
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Restricted access for store managers, fulfillment staff & admins.
          </p>
        </div>

        {/* Quick-fill one-click credentials */}
        <div className="mb-6 p-3 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Staff Role to Test:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@indigothread.in", "Indigo@123456")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("manager@indigothread.in", "Indigo@123456")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-blue-400 hover:bg-blue-500 hover:text-slate-950 transition"
            >
              🏬 Store Manager
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("support@indigothread.in", "Indigo@123456")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition"
            >
              🎧 Support
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="staff@indigothread.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Enter Operations Console <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
