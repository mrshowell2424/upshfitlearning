// @ts-nocheck
"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-[36px] font-bold text-center mb-2">Welcome back</h1>
          <p className="text-center text-text-muted mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border-strong rounded-lg focus:outline-none focus:border-charcoal"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border-strong rounded-lg focus:outline-none focus:border-charcoal"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-coral text-white font-semibold hover:bg-coral-press transition-colors disabled:bg-gray-400"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted mb-3">New to Upshift?</p>
            <a href="/auth/signup" className="text-coral font-semibold hover:text-coral-press">
              Create an account
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
