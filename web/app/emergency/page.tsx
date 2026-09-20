"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Plus, X, MapPin, Phone, Building2, Clock, Loader2, CheckCheck } from "lucide-react";
import Link from "next/link";
import { Label, Input, Select, Textarea, FieldError } from "@/components/ui/FormField";
import { api, ApiError } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { BLOOD_GROUPS, DIVISIONS, DISTRICTS_BY_DIVISION } from "@/lib/locations";
import type { Division, EmergencyRequest } from "@/lib/types";

const requestSchema = z.object({
  patientName: z.string().min(2, "রোগীর নাম দিন"),
  bloodGroup: z.enum(BLOOD_GROUPS as unknown as [string, ...string[]], {
    message: "রক্তের গ্রুপ নির্বাচন করুন",
  }),
  unitsNeeded: z.coerce.number().min(1, "কমপক্ষে ১ ইউনিট দিন"),
  division: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  hospital: z.string().min(2, "হাসপাতালের নাম দিন"),
  contactPhone: z.string().regex(/^01[3-9][0-9]{8}$/, "সঠিক ফোন নম্বর দিন"),
  note: z.string().max(300, "৩০০ অক্ষরের মধ্যে লিখুন").optional(),
  urgency: z.enum(["high", "medium", "low"]),
});

const URGENCY_LABEL: Record<EmergencyRequest["urgency"], string> = {
  high: "খুবই জরুরি",
  medium: "মধ্যম মেয়াদী",
  low: "নিয়মিত প্রয়োজন",
};

const URGENCY_STYLE: Record<EmergencyRequest["urgency"], string> = {
  high: "bg-crimson/10 text-crimson",
  medium: "bg-amber/10 text-amber",
  low: "bg-living-green/10 text-living-green",
};

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "আজ পোস্ট হয়েছে";
  if (days === 1) return "গতকাল পোস্ট হয়েছে";
  return `${days} দিন আগে পোস্ট হয়েছে`;
}

const emptyForm = {
  patientName: "",
  bloodGroup: "",
  unitsNeeded: "1",
  division: "",
  district: "",
  hospital: "",
  contactPhone: "",
  note: "",
  urgency: "high" as EmergencyRequest["urgency"],
};

interface ListResponse {
  items: EmergencyRequest[];
  total: number;
}

export default function EmergencyPage() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const myUserId = session?.user?.id;

  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [fulfillingId, setFulfillingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const districts = form.division
    ? DISTRICTS_BY_DIVISION[form.division as Division] ?? []
    : [];

  function loadRequests() {
    setLoading(true);
    setLoadError("");
    api
      .get<ListResponse>("/api/emergency?status=open")
      .then((res) => setRequests(res.items))
      .catch((err: ApiError) => setLoadError(err.message ?? "লোড করতে সমস্যা হয়েছে"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequests();
  }, []);

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const result = requestSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await api.post<EmergencyRequest>("/api/emergency", result.data);
      setForm(emptyForm);
      setShowForm(false);
      loadRequests();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "অনুরোধ পোস্ট করতে সমস্যা হয়েছে"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function markFulfilled(id: string) {
    setFulfillingId(id);
    try {
      await api.patch(`/api/emergency/${id}/fulfilled`);
      loadRequests();
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setFulfillingId(null);
    }
  }

  return (
    <main className="container-page py-14 md:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="max-w-[56ch]">
          <span className="text-crimson font-mono-data text-[13px]">জরুরি অনুরোধ</span>
          <h1 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink">
            চলমান জরুরি রক্তের অনুরোধ
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            মিলে যাওয়া ডোনারদের কাছে স্বয়ংক্রিয়ভাবে নোটিফিকেশন যায়। আপনি
            নিজেও একটা অনুরোধ পোস্ট করতে পারেন।
          </p>
        </div>
        {isLoggedIn ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold px-6 py-3 hover:bg-crimson-deep transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "ফর্ম বন্ধ করুন" : "নতুন অনুরোধ পোস্ট করুন"}
          </button>
        ) : (
          <Link
            href="/login"
            className="shrink-0 inline-flex items-center gap-2 rounded-full border border-ink/15 text-ink font-semibold px-6 py-3 hover:border-crimson/40 hover:text-crimson transition-colors"
          >
            অনুরোধ পোস্ট করতে লগইন করুন
          </Link>
        )}
      </div>

      {showForm && isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 rounded-3xl border border-line bg-paper-raised p-6 md:p-8 space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="patientName">রোগীর নাম</Label>
              <Input
                id="patientName"
                value={form.patientName}
                onChange={(e) => update("patientName", e.target.value)}
              />
              <FieldError message={errors.patientName} />
            </div>
            <div>
              <Label htmlFor="bloodGroup">প্রয়োজনীয় রক্তের গ্রুপ</Label>
              <Select
                id="bloodGroup"
                value={form.bloodGroup}
                onChange={(e) => update("bloodGroup", e.target.value)}
              >
                <option value="">নির্বাচন করুন</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.bloodGroup} />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="unitsNeeded">কত ব্যাগ প্রয়োজন</Label>
              <Input
                id="unitsNeeded"
                type="number"
                min={1}
                value={form.unitsNeeded}
                onChange={(e) => update("unitsNeeded", e.target.value)}
              />
              <FieldError message={errors.unitsNeeded} />
            </div>
            <div>
              <Label htmlFor="division">বিভাগ</Label>
              <Select
                id="division"
                value={form.division}
                onChange={(e) => {
                  update("division", e.target.value);
                  update("district", "");
                }}
              >
                <option value="">নির্বাচন করুন</option>
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.division} />
            </div>
            <div>
              <Label htmlFor="district">জেলা</Label>
              <Select
                id="district"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                disabled={!form.division}
              >
                <option value="">নির্বাচন করুন</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.district} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="hospital">হাসপাতালের নাম</Label>
              <Input
                id="hospital"
                value={form.hospital}
                onChange={(e) => update("hospital", e.target.value)}
              />
              <FieldError message={errors.hospital} />
            </div>
            <div>
              <Label htmlFor="contactPhone">যোগাযোগের নম্বর</Label>
              <Input
                id="contactPhone"
                inputMode="numeric"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="01XXXXXXXXX"
              />
              <FieldError message={errors.contactPhone} />
            </div>
          </div>

          <div>
            <Label htmlFor="urgency">জরুরি মাত্রা</Label>
            <Select
              id="urgency"
              value={form.urgency}
              onChange={(e) =>
                update("urgency", e.target.value as EmergencyRequest["urgency"])
              }
            >
              <option value="high">খুবই জরুরি (কয়েক ঘণ্টার মধ্যে)</option>
              <option value="medium">মধ্যম মেয়াদী (১-২ দিনের মধ্যে)</option>
              <option value="low">নিয়মিত প্রয়োজন (থ্যালাসেমিয়া ইত্যাদি)</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="note">বাড়তি তথ্য (ঐচ্ছিক)</Label>
            <Textarea
              id="note"
              rows={3}
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="যেমন: রোগীর অবস্থা, ওয়ার্ড নম্বর ইত্যাদি"
            />
            <FieldError message={errors.note} />
          </div>

          <FieldError message={submitError} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-full bg-ink text-paper-raised font-semibold py-3.5 hover:bg-crimson-deep transition-colors disabled:opacity-60"
          >
            {submitting ? "পোস্ট হচ্ছে..." : "অনুরোধ পোস্ট করুন"}
          </button>
        </form>
      )}

      <div className="mt-10">
        {loading ? (
          <div className="flex items-center gap-2 text-ink-soft py-12 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            লোড হচ্ছে...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-crimson/30 bg-crimson/5 p-8 text-center text-crimson">
            {loadError}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center text-ink-soft">
            এই মুহূর্তে কোনো খোলা জরুরি অনুরোধ নেই।
          </div>
        ) : (
          <div className="grid gap-5">
            {requests.map((req) => (
              <div key={req._id} className="rounded-2xl border border-line bg-paper-raised p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-lg text-ink">
                        {req.patientName}
                      </h3>
                      <span
                        className={`text-[12px] font-semibold rounded-full px-2.5 py-1 ${URGENCY_STYLE[req.urgency]}`}
                      >
                        {URGENCY_LABEL[req.urgency]}
                      </span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-ink-soft text-[14px]">
                      <Building2 className="w-3.5 h-3.5" />
                      {req.hospital}
                    </p>
                  </div>
                  <span className="font-mono-data font-bold text-lg text-crimson bg-crimson/10 rounded-lg px-3 py-1.5">
                    {req.bloodGroup} · {req.unitsNeeded} ব্যাগ
                  </span>
                </div>

                {req.note && (
                  <p className="mt-3 text-ink-soft leading-relaxed">{req.note}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {req.district}, {req.division}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(req.createdAt)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${req.contactPhone}`}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/15 text-ink font-semibold text-[14px] px-5 py-2.5 hover:border-crimson/40 hover:text-crimson transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {req.contactPhone}
                  </a>
                  {myUserId === req.postedByUserId && (
                    <button
                      onClick={() => markFulfilled(req._id)}
                      disabled={fulfillingId === req._id}
                      className="inline-flex items-center gap-2 rounded-full bg-living-green/10 text-living-green font-semibold text-[14px] px-5 py-2.5 hover:bg-living-green/20 transition-colors disabled:opacity-60"
                    >
                      {fulfillingId === req._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCheck className="w-4 h-4" />
                      )}
                      সমাধান হয়েছে
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
