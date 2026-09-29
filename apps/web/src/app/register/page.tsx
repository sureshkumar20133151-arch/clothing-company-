"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { Lock, Mail, User, Phone, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    // Validate Indian phone if provided
    if (phone && !/^[6-9]\d{9}$/.test(phone.trim())) {
      setLocalError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    try {
      await register({
        name,
        email,
        phone: phone || undefined,
        password,
      });
      router.push("/account");
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white p-8 rounded-3xl border border-kora-300 shadow-md">
        <div className="text-center mb-6">
          <span className="text-2xl font-serif font-bold text-indigo-950">
            INDIGO <span className="text-terracotta-500 font-sans font-light">&</span> THREAD
          </span>
          <h1 className="text-lg font-bold text-indigo-950 mt-2">Create your customer account</h1>
          <p className="text-xs text-indigo-900/60 mt-1">
            Join our conscious community celebrating traditional Indian handloom textile heritage.
          </p>
        </div>

        {(error || localError) && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error || localError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-indigo-950 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-indigo-900/40 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Priya Sundaram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-kora-50 border border-kora-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-950 mb-1">
              Email Address *
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
              Indian Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-indigo-900/40 absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-kora-50 border border-kora-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-indigo-950 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-950 mb-1">
              Password (Min 8 chars, 1 uppercase, 1 number) *
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
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-kora-200 text-center text-xs text-indigo-900/70">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-terracotta-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
