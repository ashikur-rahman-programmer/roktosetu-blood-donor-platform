"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { authClient } from "@/lib/auth-client";

// The additional-fields client plugin's type inference doesn't surface
// these base email+password methods in its intersection type, even though
// they exist at runtime (Better Auth's client is a runtime Proxy). Typed
// narrowly here rather than casting the whole client to `any`.
const forgetPassword = (authClient as unknown as {
  forgetPassword: (args: {
    email: string;
    redirectTo: string;
  }) => Promise<{ error: { message?: string } | null }>;
}).forgetPassword;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: reqError } = await forgetPassword({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (reqError) {
      setError(reqError.message ?? "অনুরোধ পাঠাতে সমস্যা হয়েছে");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="container-page py-24 text-center">
        <span className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-living-green/10 text-living-green">
          <Mail className="w-6 h-6" />
        </span>
        <h1 className="mt-5 font-display font-extrabold text-2xl text-ink">
          লিংক পাঠানো হয়েছে
        </h1>
        <p className="mt-3 text-ink-soft max-w-[46ch] mx-auto leading-relaxed">
          <strong>{email}</strong> এ একটা পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে —
          যদি এই ইমেইল দিয়ে সত্যিকারের একটা অ্যাকাউন্ট থাকে। ফোন নম্বর দিয়ে
          রেজিস্টার করা অ্যাকাউন্টে (যেখানে সত্যিকারের ইমেইল দেওয়া হয়নি) এই
          লিংক পৌঁছাবে না — সেক্ষেত্রে নতুন করে রেজিস্ট্রেশন করতে হবে।
        </p>
      </main>
    );
  }

  return (
    <main className="container-page py-14 md:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-balance font-display font-extrabold text-3xl text-ink">
          পাসওয়ার্ড ভুলে গেছেন?
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          আপনার রেজিস্ট্রেশনে দেওয়া ইমেইল ঠিকানা দিন — রিসেট লিংক পাঠানো
          হবে। <strong>শুধু তখনই কাজ করবে</strong> যদি রেজিস্ট্রেশনের সময়
          সত্যিকারের ইমেইল দিয়ে থাকেন।
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <FieldError message={error} />
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold py-3.5 hover:bg-crimson-deep transition-colors disabled:opacity-60"
          >
            {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-ink-soft">
          মনে পড়েছে?{" "}
          <Link href="/login" className="text-crimson font-semibold">
            লগইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
