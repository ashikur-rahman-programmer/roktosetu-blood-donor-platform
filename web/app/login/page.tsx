"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Label, Input, FieldError } from "@/components/ui/FormField";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn.email({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message ?? "লগইন ব্যর্থ হয়েছে, তথ্য যাচাই করে আবার চেষ্টা করুন");
      return;
    }
    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="container-page py-14 md:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-balance font-display font-extrabold text-3xl text-ink">
          লগইন করুন
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          আপনার প্রোফাইল দেখতে এবং রক্তদানের হিসাব আপডেট করতে লগইন করুন।
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
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Link href="/forgot-password" className="text-[13px] text-crimson font-medium">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
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
            <LogIn className="w-4 h-4" />
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-ink-soft">
          এখনো অ্যাকাউন্ট নেই?{" "}
          <Link href="/register" className="text-crimson font-semibold">
            রেজিস্ট্রেশন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
