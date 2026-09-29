"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.push("/account");
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
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white p-8 rounded-3xl border border-kora-300 shadow-md">
        <div className="text-center mb-6">
          <span className="text-2xl font-serif font-bold text-indigo-950">
            INDIGO <span className="text-terracotta-500 font-sans font-light">&</span> THREAD
          </span>
          <h1 className="text-lg font-bold text-indigo-950 mt-2">Sign in to your account</h1>
          <p className="text-xs text-indigo-900/60 mt-1">
            Access your handloom orders, saved Indian shipping addresses & wishlist.
          </p>
        </div>

        {/* Quick-Fill Demo Chips for effortless developer & user testing */}
        <div className="mb-6 p-3 bg-kora-100 rounded-2xl border border-kora-200">
          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-950 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            <span>One-Click Test Accounts:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDemoCredentials("ananya@example.com", "Indigo@123456")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-kora-300 text-indigo-950 hover:bg-indigo-950 hover:text-white transition"
            >
              🛍️ Customer
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("manager@indigothread.in", "Indigo@123456")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-kora-300 text-indigo-950 hover:bg-indigo-950 hover:text-white transition"
            >
              🏬 Store Manager
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@indigothread.in", "Indigo@123456")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-kora-300 text-indigo-950 hover:bg-indigo-950 hover:text-white transition"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-indigo-950 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-indigo-900/40 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-kora-50 border border-kora-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-950 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-indigo-900/40 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-kora-50 border border-kora-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-kora-200 text-center text-xs text-indigo-900/70">
          New to Indigo & Thread?{" "}
          <Link href="/register" className="font-bold text-terracotta-600 hover:underline">
            Create an artisanal account
          </Link>
        </div>
      </div>
    </div>
  );
}
