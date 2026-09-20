"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Droplet,
  MapPin,
  Phone,
  Award,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { api, ApiError } from "@/lib/api-client";
import { daysSince, daysAgoLabel, isEligible } from "@/lib/date-helpers";
import type { Donor } from "@/lib/types";

const DONATION_GAP_DAYS = Number(process.env.NEXT_PUBLIC_DONATION_GAP_DAYS ?? 90);

interface DonationHistoryEntry {
  _id: string;
  donatedAt: string;
  note?: string;
}

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [profile, setProfile] = useState<Donor | null>(null);
  const [history, setHistory] = useState<DonationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    Promise.all([
      api.get<Donor>("/api/users/me"),
      api.get<DonationHistoryEntry[]>("/api/users/me/history"),
    ])
      .then(([profileRes, historyRes]) => {
        setProfile(profileRes);
        setHistory(historyRes);
      })
      .catch((err: ApiError) => setError(err.message ?? "প্রোফাইল লোড করতে সমস্যা হয়েছে"))
      .finally(() => setLoading(false));
  }, [session, sessionLoading]);

  async function handleConfirmDonation() {
    setActionLoading(true);
    try {
      await api.post("/api/users/me/donate");
      const [updated, updatedHistory] = await Promise.all([
        api.get<Donor>("/api/users/me"),
        api.get<DonationHistoryEntry[]>("/api/users/me/history"),
      ]);
      setProfile(updated);
      setHistory(updatedHistory);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setActionLoading(false);
      setConfirming(false);
    }
  }

  async function handleToggleAvailability() {
    if (!profile) return;
    setActionLoading(true);
    try {
      await api.patch("/api/users/me/availability", { isAvailable: !profile.isAvailable });
      setProfile({ ...profile, isAvailable: !profile.isAvailable });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setActionLoading(false);
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
          প্রোফাইল দেখতে লগইন করুন
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

  if (error && !profile) {
    return (
      <main className="container-page py-24 text-center text-crimson">{error}</main>
    );
  }

  if (!profile) return null;

  const eligible = isEligible(profile.lastDonationDate);
  const waitDays = eligible
    ? 0
    : DONATION_GAP_DAYS - (daysSince(profile.lastDonationDate) ?? 0);
  const currentlyAvailable = profile.isAvailable && eligible;

  return (
    <main className="container-page py-14 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-crimson font-mono-data text-[13px]">আমার প্রোফাইল</span>
            <h1 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink">
              {profile.name}
            </h1>
          </div>
          <button
            onClick={() => signOut()}
            className="shrink-0 inline-flex items-center gap-1.5 text-[14px] text-ink-soft hover:text-crimson transition-colors"
          >
            <LogOut className="w-4 h-4" />
            লগআউট
          </button>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-line bg-paper-raised p-6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink-soft">উপলব্ধতা</span>
              <button
                onClick={handleToggleAvailability}
                disabled={!eligible || actionLoading}
                className="text-ink-soft disabled:opacity-40"
                aria-label="উপলব্ধতা টগল করুন"
              >
                {profile.isAvailable ? (
                  <ToggleRight className="w-8 h-8 text-living-green" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
            <p
              className={`mt-3 font-display font-bold text-xl ${
                currentlyAvailable ? "text-living-green" : "text-ink-soft"
              }`}
            >
              {currentlyAvailable
                ? "এখন উপলব্ধ"
                : !eligible
                  ? `আরও ${waitDays} দিন পর উপলব্ধ হবে`
                  : "নিজে থেকে বন্ধ রাখা হয়েছে"}
            </p>
            {!eligible && (
              <p className="mt-1.5 text-[13px] text-ink-soft">
                মেডিকেল গাইডলাইন অনুযায়ী {DONATION_GAP_DAYS} দিন বিশ্রাম প্রয়োজন।
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-paper-raised p-6">
            <span className="text-[13px] font-semibold text-ink-soft">সর্বশেষ রক্তদান</span>
            <p className="mt-3 font-display font-bold text-xl text-ink">
              {daysAgoLabel(profile.lastDonationDate)}
            </p>
            <p className="mt-1.5 text-[13px] text-ink-soft">
              রক্ত দেওয়ার সাথে সাথেই নিচের বাটনে চাপ দিন — তারিখ ও উপলব্ধতা
              স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-paper-raised p-6 flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex items-center gap-2 text-ink">
            <Droplet className="w-4 h-4 text-crimson" />
            <span className="font-mono-data font-bold">{profile.bloodGroup}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft">
            <MapPin className="w-4 h-4" />
            {profile.upazila}, {profile.district}, {profile.division}
          </div>
          {profile.phone && (
            <div className="flex items-center gap-2 text-ink-soft">
              <Phone className="w-4 h-4" />
              {profile.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-ink-soft">
            <Award className="w-4 h-4" />
            মোট {profile.donationCount} বার রক্ত দিয়েছেন
          </div>
        </div>

        {error && <p className="mt-4 text-[14px] text-crimson">{error}</p>}

        <div className="mt-8">
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold px-7 py-3.5 hover:bg-crimson-deep transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              আজ রক্ত দিয়েছি
            </button>
          ) : (
            <div className="rounded-2xl border border-crimson/30 bg-crimson/5 p-6 max-w-md">
              <p className="text-ink font-medium">
                নিশ্চিত করছেন যে আপনি আজ রক্ত দিয়েছেন? এটি আপনার সর্বশেষ
                রক্তদানের তারিখ আপডেট করবে এবং আপনাকে সাময়িকভাবে
                &ldquo;অনুপলব্ধ&rdquo; করে দেবে।
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleConfirmDonation}
                  disabled={actionLoading}
                  className="rounded-full bg-crimson text-paper-raised font-semibold px-5 py-2.5 disabled:opacity-60"
                >
                  {actionLoading ? "আপডেট হচ্ছে..." : "হ্যাঁ, নিশ্চিত করুন"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="rounded-full border border-line text-ink-soft font-semibold px-5 py-2.5"
                >
                  বাতিল করুন
                </button>
              </div>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display font-bold text-lg text-ink">রক্তদানের ইতিহাস</h2>
            <div className="mt-3 grid gap-2">
              {history.map((h, i) => (
                <div
                  key={h._id}
                  className="flex items-center justify-between rounded-xl border border-line bg-paper-raised px-4 py-3"
                >
                  <span className="inline-flex items-center gap-2 text-ink">
                    <Award className="w-4 h-4 text-amber" />
                    {history.length - i}ম রক্তদান
                  </span>
                  <span className="font-mono-data text-[13px] text-ink-soft">
                    {new Date(h.donatedAt).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
