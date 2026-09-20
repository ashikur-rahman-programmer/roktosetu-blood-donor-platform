# RoktoSetu — Backend (server/)

পুরো প্রজেক্টের overview ও ডিপ্লয়মেন্ট গাইডের জন্য দেখুন: `../README.md`

```bash
cp .env.example .env   # MONGODB_URI, BETTER_AUTH_SECRET ইত্যাদি বসান
npm install
npm run dev             # tsx দিয়ে watch mode, http://localhost:4000
```

```bash
npm run build            # tsc -> dist/
npm run start             # node dist/server.js
npm run typecheck          # শুধু টাইপ চেক (কোনো ফাইল লেখে না)
npm test                    # vitest — date/eligibility লজিক ও Zod schema টেস্ট
```

## মডিউল স্ট্রাকচার
```
src/
  config/          -> env.ts, db.ts (MongoDB native + Mongoose কানেকশন)
  modules/
    auth/           -> auth.config.ts (Better Auth), auth.routes.ts
    user/            -> প্রোফাইল, সার্চ, "আজ রক্ত দিয়েছি"
    emergency/        -> জরুরি অনুরোধ CRUD
    admin/             -> ডোনার ভেরিফিকেশন/রিমুভাল (role: admin)
    donation/           -> DonationHistory মডেল
  middlewares/        -> session, RBAC, error handler, rate limit
  jobs/                -> availability.cron.ts (দৈনিক উপলব্ধতা রিসেট)
  lib/notify.ts         -> sendEmail/sendSms স্টাব (console.log — real provider ছাড়া কিছু ডেলিভার হয় না)
  __tests__/              -> vitest ইউনিট টেস্ট
  app.ts, server.ts
```

## API সংক্ষেপে

| Method | Path | Auth | কাজ |
|---|---|---|---|
| POST | /api/auth/sign-up/email | — | রেজিস্ট্রেশন |
| POST | /api/auth/sign-in/email | — | লগইন |
| POST | /api/auth/sign-out | ✔ | লগআউট |
| GET | /api/users/search | ✔ | ডোনার সার্চ (ফোন নম্বরসহ — লগইন লাগবে) |
| GET | /api/users/me | ✔ | নিজের প্রোফাইল |
| PATCH | /api/users/me | ✔ | প্রোফাইল আপডেট |
| POST | /api/users/me/donate | ✔ | "আজ রক্ত দিয়েছি" |
| PATCH | /api/users/me/availability | ✔ | উপলব্ধতা টগল |
| GET | /api/users/me/history | ✔ | রক্তদানের ইতিহাস |
| GET | /api/emergency | — | জরুরি অনুরোধের তালিকা |
| POST | /api/emergency | ✔ | নতুন জরুরি অনুরোধ |
| PATCH | /api/emergency/:id/fulfilled | ✔ | নিজের অনুরোধ বন্ধ করা |
| GET | /api/admin/donors/unverified | ✔ (admin) | অভেরিফায়েড ডোনার তালিকা |
| PATCH | /api/admin/donors/:id/verify | ✔ (admin) | ভেরিফাই করা |
| DELETE | /api/admin/donors/:id | ✔ (admin) | ডোনার রিমুভ করা |

> **নোট:** `/api/users/search` ইচ্ছাকৃতভাবে ডোনারের ফোন নম্বর সরাসরি
> রিটার্ন করে (approval flow নেই) — ডোনার অফলাইনে থাকলেও যেন খুঁজে পাওয়া
> যায়। বিস্তারিত ট্রেড-অফ `../README.md`-এর "গুরুত্বপূর্ণ সীমাবদ্ধতা"
> সেকশনে আছে।
