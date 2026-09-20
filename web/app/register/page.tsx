"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { Label, Input, Select, FieldError } from "@/components/ui/FormField";
import { BLOOD_GROUPS, DIVISIONS, DISTRICTS_BY_DIVISION } from "@/lib/locations";
import type { Division } from "@/lib/types";
import { signUp } from "@/lib/auth-client";

const registerSchema = z
  .object({
    name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে"),
    phone: z
      .string()
      .regex(/^01[3-9][0-9]{8}$/, "সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন 01712345678)"),
    email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
    password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
    bloodGroup: z.enum(BLOOD_GROUPS as unknown as [string, ...string[]], {
      message: "রক্তের গ্রুপ নির্বাচন করুন",
    }),
    division: z.string().min(1, "বিভাগ নির্বাচন করুন"),
    district: z.string().min(1, "জেলা নির্বাচন করুন"),
    upazila: z.string().min(2, "উপজেলা/থানার নাম দিন"),
    hasDonatedBefore: z.boolean(),
    lastDonationDate: z.string().optional(),
  })
  .refine(
    (data) => !data.hasDonatedBefore || !!data.lastDonationDate,
    { message: "শেষ রক্তদানের তারিখ দিন", path: ["lastDonationDate"] }
  );

type FormState = {
  name: string;
  phone: string;
  email: string;
  password: string;
  bloodGroup: string;
  division: string;
  district: string;
  upazila: string;
  hasDonatedBefore: boolean;
  lastDonationDate: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  password: "",
  bloodGroup: "",
  division: "",
  district: "",
  upazila: "",
  hasDonatedBefore: false,
  lastDonationDate: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const districts = form.division
    ? DISTRICTS_BY_DIVISION[form.division as Division] ?? []
    : [];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const { error } = await signUp.email({
      name: form.name,
      email: form.email || `${form.phone}@roktosetu.local`, // Better Auth requires an email; donors without one get a placeholder tied to their phone
      password: form.password,
      // Custom donor fields — allowed because they're declared as
      // `additionalFields` with input !== false on the server.
      phone: form.phone,
      bloodGroup: form.bloodGroup,
      division: form.division,
      district: form.district,
      upazila: form.upazila,
      lastDonationDate: form.hasDonatedBefore ? new Date(form.lastDonationDate) : undefined,
    });

    setLoading(false);

    if (error) {
      setServerError(error.message ?? "রেজিস্ট্রেশন ব্যর্থ হয়েছে, আবার চেষ্টা করুন");
      return;
    }

    // Better Auth signs the user in immediately after sign-up (autoSignIn),
    // so we can go straight to their profile.
    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="container-page py-14 md:py-20">
      <div className="max-w-2xl mx-auto">
        <span className="badge-pulse inline-flex items-center text-crimson font-mono-data text-[13px]">
          ১ মিনিটেই সম্পন্ন
        </span>
        <h1 className="text-balance mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink">
          ডোনার হিসেবে যুক্ত হোন
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed max-w-[52ch]">
          তথ্য যত সঠিক হবে, জরুরি সময়ে ঠিক মানুষটার কাছে খবর পৌঁছানো তত সহজ
          হবে। আপনার ফোন নম্বর আপনার অনুমতি ছাড়া কাউকে দেখানো হবে না।
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
          <div>
            <Label htmlFor="name">পুরো নাম</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="যেমন: মোঃ আশিকুর রহমান"
            />
            <FieldError message={errors.name} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input
                id="phone"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="01XXXXXXXXX"
              />
              <FieldError message={errors.phone} />
            </div>
            <div>
              <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
              />
              <FieldError message={errors.email} />
            </div>
          </div>

          <div>
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="কমপক্ষে ৬ অক্ষর"
            />
            <FieldError message={errors.password} />
          </div>

          <div>
            <Label htmlFor="bloodGroup">রক্তের গ্রুপ</Label>
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

          <div className="grid sm:grid-cols-3 gap-6">
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
            <div>
              <Label htmlFor="upazila">উপজেলা/থানা</Label>
              <Input
                id="upazila"
                value={form.upazila}
                onChange={(e) => update("upazila", e.target.value)}
                placeholder="যেমন: পাবনা সদর"
              />
              <FieldError message={errors.upazila} />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-paper-raised p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasDonatedBefore}
                onChange={(e) => update("hasDonatedBefore", e.target.checked)}
                className="w-4 h-4 accent-crimson"
              />
              <span className="text-[15px] text-ink font-medium">
                আমি আগে কখনো রক্ত দিয়েছি
              </span>
            </label>

            {form.hasDonatedBefore && (
              <div className="mt-4">
                <Label htmlFor="lastDonationDate">শেষ কবে রক্ত দিয়েছেন</Label>
                <Input
                  id="lastDonationDate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={form.lastDonationDate}
                  onChange={(e) => update("lastDonationDate", e.target.value)}
                />
                <FieldError message={errors.lastDonationDate} />
                <p className="mt-2 text-[13px] text-ink-soft">
                  এই তারিখ থেকেই আপনার পরবর্তী উপলব্ধতা স্বয়ংক্রিয়ভাবে হিসাব হবে।
                </p>
              </div>
            )}
          </div>

          <FieldError message={serverError} />

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-crimson text-paper-raised font-semibold py-3.5 hover:bg-crimson-deep transition-colors disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন সম্পন্ন করুন"}
          </button>

          <p className="text-center text-[13px] text-ink-soft">
            রেজিস্ট্রেশন করার মাধ্যমে আপনি আমাদের ব্যবহারবিধি ও প্রাইভেসি
            নীতিতে সম্মত হচ্ছেন।
          </p>
        </form>
      </div>
    </main>
  );
}
