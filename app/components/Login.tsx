"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (!res.succeeded) throw new Error(res.message || res.errors?.[0]);
      setToken(res.data.token);
      const role = res.data.role?.toLowerCase();
      router.push(role === "admin" ? "/pages/dashboard/overview" : "/pages/student/overview");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-16 relative overflow-hidden select-none">
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-indigo-500 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-700 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight">Course Manager</span>
        </div>

        <div className="relative space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
              The smarter way to manage courses.
            </h2>
            <p className="text-indigo-200 text-base leading-relaxed max-w-xs">
              Organize classes, track student performance, and generate insights — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "2,400+", label: "Students tracked" },
              { value: "98%", label: "Instructor satisfaction" },
              { value: "150+", label: "Courses managed" },
              { value: "4.9★", label: "Average rating" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-bold text-xl">{value}</p>
                <p className="text-indigo-200 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-indigo-300/60 text-xs">© {new Date().getFullYear()} Course Manager</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">Course Manager</span>
          </div>

          <div className="mb-9">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in</h1>
            <p className="text-slate-400 text-sm mt-1">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-slate-50/50"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-500 hover:text-indigo-600 transition">Forgot?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition bg-slate-50/50"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm text-slate-400">
            No account?{" "}
            <Link href="/pages/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
