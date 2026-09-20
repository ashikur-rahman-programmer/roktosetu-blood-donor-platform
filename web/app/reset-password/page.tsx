"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { authClient } from "@/lib/auth-client";

// See forgot-password/page.tsx for why this is typed manually.
const resetPassword = (authClient as unknown as {
  resetPassword: (args: {
    newPassword: string;
    token: string;
  }) => Promise<{ error: { message?: string } | null }>;
}).resetPassword;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("লিংকটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    const { error: resetError } = await resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message ?? "রিসেট করতে সমস্যা হয়েছে, লিংকটি আবার চেষ্টা করুন");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (done) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="font-display font-extrabold text-2xl text-ink">
          পাসওয়ার্ড পরিবর্তন হয়েছে
        </h1>
        <p className="mt-3 text-ink-soft">লগইন পেজে নিয়ে যাওয়া হচ্ছে...</p>
      </main>
    );
  }

  return (
    <main className="container-page py-14 md:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-balance font-display font-extrabold text-3xl text-ink">
          নতুন পাসওয়ার্ড দিন
        </h1>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <FieldError message={error} />
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold py-3.5 hover:bg-crimson-deep transition-colors disabled:opacity-60"
          >
            {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="container-page py-24 flex items-center justify-center gap-2 text-ink-soft">
          <Loader2 className="w-5 h-5 animate-spin" />
          লোড হচ্ছে...
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
