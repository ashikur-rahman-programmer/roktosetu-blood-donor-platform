"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Loader2, LogIn } from "lucide-react";
import { Label, Select } from "@/components/ui/FormField";
import DonorCard from "@/components/donor/DonorCard";
import { api, ApiError } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { BLOOD_GROUPS, DIVISIONS, DISTRICTS_BY_DIVISION } from "@/lib/locations";
import type { Division, Donor } from "@/lib/types";

interface SearchResponse {
  donors: Donor[];
  total: number;
  page: number;
  limit: number;
}

export default function SearchPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [bloodGroup, setBloodGroup] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const [results, setResults] = useState<Donor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const districts = division ? DISTRICTS_BY_DIVISION[division as Division] ?? [] : [];

  function fetchPage(pageNum: number, append: boolean) {
    const params = new URLSearchParams();
    if (bloodGroup) params.set("bloodGroup", bloodGroup);
    if (division) params.set("division", division);
    if (district) params.set("district", district);
    params.set("onlyAvailable", String(onlyAvailable));
    params.set("page", String(pageNum));

    if (append) setLoadingMore(true);
    else setLoading(true);
    setError("");

    api
      .get<SearchResponse>(`/api/users/search?${params.toString()}`)
      .then((res) => {
        setResults((prev) => (append ? [...prev, ...res.donors] : res.donors));
        setTotal(res.total);
        setPage(res.page);
      })
      .catch((err: ApiError) => setError(err.message ?? "ডোনার লোড করতে সমস্যা হয়েছে"))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, sessionLoading, bloodGroup, division, district, onlyAvailable]);

  const hasMore = results.length < total;

  return (
    <main className="container-page py-14 md:py-20">
      <div className="max-w-[56ch]">
        <span className="text-crimson font-mono-data text-[13px]">ডোনার সার্চ</span>
        <h1 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink">
          এখনই কাছাকাছি ডোনার খুঁজুন
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          রক্তের গ্রুপ ও এলাকা দিয়ে ফিল্টার করুন — উপলব্ধ ডোনারদের নম্বর
          সরাসরি এখানেই দেখতে পাবেন।
        </p>
      </div>

      {!sessionLoading && !session?.user ? (
        <div className="mt-10 rounded-2xl border border-line bg-paper-raised p-10 text-center max-w-md">
          <p className="text-ink-soft">
            ডোনারের নম্বর দেখতে লগইন করা প্রয়োজন — এতে অ্যাকাউন্টবিহীন
            কেউ সবার নম্বর সংগ্রহ করতে পারবে না।
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold px-6 py-3"
          >
            <LogIn className="w-4 h-4" />
            লগইন করুন
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="rounded-2xl border border-line bg-paper-raised p-6 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-ink font-semibold">
              <SlidersHorizontal className="w-4 h-4" />
              ফিল্টার
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <Label htmlFor="f-blood">রক্তের গ্রুপ</Label>
                <Select
                  id="f-blood"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="">সব গ্রুপ</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="f-division">বিভাগ</Label>
                <Select
                  id="f-division"
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                    setDistrict("");
                  }}
                >
                  <option value="">সব বিভাগ</option>
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="f-district">জেলা</Label>
                <Select
                  id="f-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!division}
                >
                  <option value="">সব জেলা</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-crimson"
                />
                <span className="text-[14px] text-ink font-medium">
                  শুধু এখন উপলব্ধ ডোনার দেখান
                </span>
              </label>
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="flex items-center gap-2 text-ink-soft py-12 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                লোড হচ্ছে...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-crimson/30 bg-crimson/5 p-8 text-center text-crimson">
                {error}
              </div>
            ) : (
              <>
                <p className="text-ink-soft text-[14px] mb-4 font-mono-data">
                  {total} জন ডোনার পাওয়া গেছে
                  {results.length < total && ` (${results.length}টি দেখানো হচ্ছে)`}
                </p>

                {results.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line p-12 text-center text-ink-soft">
                    এই মুহূর্তে এই ফিল্টারে কোনো ডোনার পাওয়া যায়নি। ফিল্টার
                    বদলে আবার চেষ্টা করুন, অথবা একটা{" "}
                    <Link href="/emergency" className="text-crimson font-semibold">
                      জরুরি অনুরোধ
                    </Link>{" "}
                    পোস্ট করুন।
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {results.map((donor) => (
                        <DonorCard key={donor.id} donor={donor} />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => fetchPage(page + 1, true)}
                          disabled={loadingMore}
                          className="inline-flex items-center gap-2 rounded-full border border-ink/15 text-ink font-semibold px-6 py-3 hover:border-crimson/40 hover:text-crimson transition-colors disabled:opacity-60"
                        >
                          {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                          {loadingMore ? "লোড হচ্ছে..." : "আরও দেখুন"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
