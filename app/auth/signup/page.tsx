// @ts-nocheck
"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/auth";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-md text-center">
            <h2 className="text-[28px] font-bold mb-4">Account created!</h2>
            <p className="text-text-muted mb-6">
              Check your email to verify your account. Redirecting to login...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-[36px] font-bold text-center mb-2">Get started</h1>
          <p className="text-center text-text-muted mb-8">Create your Upshift account</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2 border border-border-strong rounded-lg focus:outline-none focus:border-charcoal"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border-strong rounded-lg focus:outline-none focus:border-charcoal"
                disabled={loading}
                required
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
                required
              />
              <p className="text-xs text-text-muted mt-1">At least 8 characters</p>
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted mb-3">Already have an account?</p>
            <a href="/auth/login" className="text-coral font-semibold hover:text-coral-press">
              Sign in
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
