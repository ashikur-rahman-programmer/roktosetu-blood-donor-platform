"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Trash2, Loader2, Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { api, ApiError } from "@/lib/api-client";

interface UnverifiedDonor {
  _id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  division: string;
  district: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  const [donors, setDonors] = useState<UnverifiedDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError("");
    api
      .get<UnverifiedDonor[]>("/api/admin/donors/unverified")
      .then(setDonors)
      .catch((err: ApiError) => setError(err.message ?? "লোড করতে সমস্যা হয়েছে"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (sessionLoading) return;
    if (role !== "admin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    load();
  }, [sessionLoading, role]);

  async function verify(id: string) {
    setActingId(id);
    try {
      await api.patch(`/api/admin/donors/${id}/verify`);
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "ভেরিফাই করতে সমস্যা হয়েছে");
    } finally {
      setActingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("এই ডোনারকে স্থায়ীভাবে রিমুভ করবেন?")) return;
    setActingId(id);
    try {
      await api.delete(`/api/admin/donors/${id}`);
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "রিমুভ করতে সমস্যা হয়েছে");
    } finally {
      setActingId(null);
    }
  }

  if (sessionLoading || loading) {
    return (
      <main className="container-page py-24 flex items-center justify-center gap-2 text-ink-soft">
        <Loader2 className="w-5 h-5 animate-spin" />
        লোড হচ্ছে...
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="font-display font-extrabold text-2xl text-ink">
          লগইন করা প্রয়োজন
        </h1>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center rounded-full bg-crimson text-paper-raised font-semibold px-7 py-3"
        >
          লগইন করুন
        </Link>
      </main>
    );
  }

  if (role !== "admin") {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="font-display font-extrabold text-2xl text-ink">
          এই পেজ শুধু অ্যাডমিনদের জন্য
        </h1>
        <p className="mt-3 text-ink-soft">
          আপনার অ্যাকাউন্টে admin অনুমতি নেই।
        </p>
      </main>
    );
  }

  return (
    <main className="container-page py-14 md:py-20">
      <span className="text-crimson font-mono-data text-[13px]">অ্যাডমিন প্যানেল</span>
      <h1 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink">
        অভেরিফায়েড ডোনার
      </h1>
      <p className="mt-3 text-ink-soft leading-relaxed max-w-[56ch]">
        নতুন রেজিস্ট্রেশন যাচাই করে ভেরিফাই করুন, অথবা ভুয়া/সন্দেহজনক
        প্রোফাইল রিমুভ করুন।
      </p>

      {error && <p className="mt-4 text-[14px] text-crimson">{error}</p>}

      {donors.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-ink-soft">
          এই মুহূর্তে অভেরিফায়েড কোনো ডোনার নেই।
        </div>
      ) : (
        <div className="mt-10 grid gap-3">
          {donors.map((d) => (
            <div
              key={d._id}
              className="rounded-2xl border border-line bg-paper-raised p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-ink">{d.name}</p>
                <p className="mt-1 text-[14px] text-ink-soft">
                  {d.phone} · {d.bloodGroup} · {d.district}, {d.division}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => verify(d._id)}
                  disabled={actingId === d._id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-living-green/10 text-living-green font-semibold text-[14px] px-4 py-2 hover:bg-living-green/20 transition-colors disabled:opacity-60"
                >
                  {actingId === d._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  ভেরিফাই
                </button>
                <button
                  onClick={() => remove(d._id)}
                  disabled={actingId === d._id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 text-crimson font-semibold text-[14px] px-4 py-2 hover:bg-crimson/20 transition-colors disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" />
                  রিমুভ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 flex items-center gap-2 text-[13px] text-ink-soft">
        <ShieldCheck className="w-4 h-4" />
        কাউকে admin বানাতে হলে MongoDB-তে সরাসরি গিয়ে তার user ডকুমেন্টে
        <code className="mx-1 rounded bg-line px-1.5 py-0.5">role: &quot;admin&quot;</code>
        সেট করতে হবে।
      </p>
    </main>
  );
}
