# RoktoSetu – Blood Donor Network Bangladesh

সম্পূর্ণ ফ্রি ব্লাড ডোনার খোঁজার প্ল্যাটফর্ম। দুটো আলাদাভাবে ডিপ্লয়যোগ্য
অ্যাপ:

```
web/     -> Next.js 16 ফ্রন্টএন্ড (Vercel-এ ডিপ্লয় করুন)
server/  -> Express + MongoDB + Better Auth ব্যাকএন্ড (Render/Railway-তে ডিপ্লয় করুন)
```

## স্ট্যাক

| অংশ | টুল |
|---|---|
| ফ্রন্টএন্ড | Next.js 16, React 19, Tailwind CSS v4, Zod |
| ব্যাকএন্ড | Node.js, Express 5, TypeScript |
| ডেটাবেজ | MongoDB (Better Auth-এর জন্য native driver, বাকি মডেলের জন্য Mongoose) |
| অথ | Better Auth (email+password, OTP ছাড়া) |
| ভ্যালিডেশন | Zod (দুই দিকেই) |

## কীভাবে সব একসাথে কাজ করে

1. **`web`** ব্রাউজারে চলে, `NEXT_PUBLIC_API_URL` এনভায়রনমেন্ট ভ্যারিয়েবলে
   বলা ঠিকানায় **`server`**-কে API কল করে (fetch, `credentials: "include"`
   দিয়ে — Better Auth-এর সেশন কুকি পাঠানোর জন্য)।
2. **`server`** Better Auth-এর হ্যান্ডলার `/api/auth/*`-এ মাউন্ট করে
   (sign-up, sign-in, sign-out, session — সব এখানে), আর নিজের রুট
   `/api/users/*`, `/api/emergency/*`, `/api/admin/*`-এ থাকে।
3. প্রতিটা ডোনারের **রক্তের গ্রুপ, লোকেশন, `lastDonationDate`,
   `isAvailable`, `donationCount`** — এগুলো Better Auth-এর user টেবিলেই
   `additionalFields` হিসেবে থাকে (আলাদা "profile" কালেকশন রাখা হয়নি, যাতে
   auth ও profile ডেটা আলাদা সিঙ্ক করতে না হয়)।
4. প্রতিদিন একবার **cron job** (`server/src/jobs/availability.cron.ts`)
   চেক করে কার `DONATION_GAP_DAYS` (ডিফল্ট ৯০ দিন) শেষ হয়েছে, আর তাকে
   স্বয়ংক্রিয়ভাবে আবার "উপলব্ধ" করে দেয়।

## লোকালি চালানোর নিয়ম

```bash
# টার্মিনাল ১ — ব্যাকএন্ড
cd server
cp .env.example .env     # MONGODB_URI ইত্যাদি বসান
npm install
npm run dev               # http://localhost:4000

# টার্মিনাল ২ — ফ্রন্টএন্ড
cd web
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

লোকালি টেস্ট করতে একটা MongoDB দরকার — হয় নিজের মেশিনে `mongod` চালান, অথবা
সরাসরি [MongoDB Atlas](https://www.mongodb.com/atlas) এর ফ্রি টায়ার থেকে
একটা `MONGODB_URI` নিয়ে `.env`-এ বসান (production-এও এটাই লাগবে)।

## ডিপ্লয়মেন্ট (তোমার যা করতে হবে)

### ১. MongoDB Atlas
- একটা ফ্রি cluster তৈরি করুন (M0 tier)।
- একটা ডেটাবেজ ইউজার তৈরি করুন, আর Network Access-এ `0.0.0.0/0` (অথবা
  Render/Railway-র IP) allow করুন।
- Connection string কপি করুন — এটাই `MONGODB_URI`।

### ২. ব্যাকএন্ড → Render বা Railway
- এই রিপোর `server/` ফোল্ডারকে নিজের root বানিয়ে একটা নতুন Web Service
  তৈরি করুন।
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- `server/.env.example`-এ যা যা আছে, সব env variable বসান — বিশেষ করে
  `MONGODB_URI`, `BETTER_AUTH_SECRET` (নতুন random string), `BETTER_AUTH_URL`
  (এই সার্ভিসের নিজের public URL), আর `CORS_ORIGINS`-এ পরের ধাপে পাওয়া
  Vercel URL বসাতে হবে (ডিপ্লয়ের পর একবার আপডেট করে আবার ডিপ্লয় করুন)।

### ৩. ফ্রন্টএন্ড → Vercel
- এই রিপোর `web/` ফোল্ডারকে root Directory হিসেবে বেছে একটা নতুন Vercel
  প্রজেক্ট তৈরি করুন (Framework preset: Next.js, auto-detect হয়ে যাবে)।
- Environment variable: `NEXT_PUBLIC_API_URL` = আপনার Render/Railway
  ব্যাকএন্ডের public URL।
- ডিপ্লয় করুন, তারপর এই URL টা ব্যাকএন্ডের `CORS_ORIGINS`-এ যোগ করে
  ব্যাকএন্ড আবার ডিপ্লয় করুন (দুই দিকেই একে অপরের URL জানা দরকার)।

### ৪. যাচাই করুন
- `https://your-backend/health` এ গেলে `{"ok":true}` দেখা উচিত।
- ফ্রন্টএন্ডে গিয়ে রেজিস্ট্রেশন করে দেখুন — কাজ করলে বুঝবেন
  MongoDB + Better Auth + CORS সব ঠিকঠাক কানেক্ট হয়েছে।

## ✅ এখন যা যা আছে (সম্পূর্ণ ফিচার লিস্ট)

- Better Auth দিয়ে email+password রেজিস্ট্রেশন/লগইন/লগআউট (OTP ছাড়া)
- **পাসওয়ার্ড রিসেট** (`/forgot-password`, `/reset-password`) — নিচে
  সীমাবদ্ধতা দেখুন
- ডোনার সার্চ (গ্রুপ+এলাকা ফিল্টার, ফোন নম্বর সরাসরি, pagination/"আরও দেখুন")
- "আজ রক্ত দিয়েছি" — ওয়ান-ক্লিক আপডেট + প্রোফাইলে real রক্তদানের ইতিহাস
- দৈনিক cron — ৯০ দিন পর স্বয়ংক্রিয় availability রিসেট
- জরুরি অনুরোধ পোস্ট, পাবলিক লিস্ট, নিজের অনুরোধ "সমাধান হয়েছে" মার্ক করা
- **অ্যাডমিন প্যানেল UI** (`/admin`) — ভেরিফাই/রিমুভ, role-gated
- Phone-view audit log (`PhoneViewLog` কালেকশন) — কে কার নম্বর দেখেছে তার
  রেকর্ড রাখা হয়, যেহেতু নম্বর approval ছাড়াই দেখানো হয়
- Emergency post হলে matching available ডোনারদের SMS পাঠানোর infrastructure
  (নিচে সীমাবদ্ধতা দেখুন)
- Server-side ইউনিট টেস্ট (`cd server && npm test`) — date/eligibility লজিক
  ও Zod validation schema-র জন্য, ১৪টা টেস্ট, সবকটা pass করে

## গুরুত্বপূর্ণ সীমাবদ্ধতা (সততার সাথে জানানো)

- এই কোড **কোনো লাইভ MongoDB-র বিরুদ্ধে টেস্ট করা হয়নি** — যে স্যান্ডবক্সে
  এটা বানানো হয়েছে সেখানে ইন্টারনেট অ্যাক্সেস নির্দিষ্ট কিছু ডোমেইনে
  সীমাবদ্ধ, তাই MongoDB Atlas-এ কানেক্ট করে দেখা সম্ভব হয়নি। TypeScript
  build (`tsc`), lint, ইউনিট টেস্ট, এবং compiled কোড লোড হওয়া পর্যন্ত
  সবকিছু যাচাই করা হয়েছে — কিন্তু আসল ডেটাবেজ কানেকশন/কুয়েরি প্রথমবার
  production/লোকাল environment-এ চালানোর সময়ই আসল পরীক্ষা হবে।
- **SMS ও ইমেইল আসলে পাঠানো হয় না।** `server/src/lib/notify.ts`-এ
  `sendEmail`/`sendSms` দুটোই এখন শুধু `console.log` করে — কোড ঠিকভাবে
  wire করা আছে (পাসওয়ার্ড রিসেট ইমেইল, emergency-তে matching ডোনারদের SMS)
  কিন্তু বাস্তবে কিছুই ডেলিভার হয় না, কারণ কোনো real provider
  (Resend/SMTP, বা কোনো বাংলাদেশি SMS gateway) এর account/API key ছাড়া
  পাঠানো সম্ভব না — সেটা এই sandbox থেকে বানানো বা টেস্ট করা যায় না।
  Provider বসালে শুধু `notify.ts`-এর দুটো ফাংশনের ভেতরটা বদলাতে হবে।
- **পাসওয়ার্ড রিসেট শুধু তাদের জন্য কাজ করবে যারা সত্যিকারের ইমেইল দিয়ে
  রেজিস্টার করেছেন।** যেহেতু ইমেইল ঐচ্ছিক এবং না দিলে একটা placeholder
  ইমেইল (`<phone>@roktosetu.local`) বানানো হয় (`web/app/register/page.tsx`),
  সেই অ্যাকাউন্টে রিসেট লিংক পাঠানোর কোনো real ইনবক্স নেই। ভবিষ্যতে
  সত্যিকারের phone-based auth (custom Better Auth plugin দিয়ে, OTP ছাড়াই)
  বসালে এই সীমাবদ্ধতা দূর হবে।
- **ডিজাইন সিদ্ধান্ত (গুরুত্বপূর্ণ ট্রেড-অফ):** সার্চ রেজাল্টে উপলব্ধ
  ডোনারের ফোন নম্বর সরাসরি দেখানো হয় (কোনো donor-approval flow নেই) — এতে
  ডোনার অফলাইনে থাকলেও requester তাকে সরাসরি কল করতে পারবেন। বিনিময়ে
  privacy একটু কম — এটা কিছুটা ঠেকাতে সার্চ করতে **লগইন বাধ্যতামূলক**
  (`GET /api/users/search` এ `requireAuth`) এবং প্রতিটা ভিউ
  `PhoneViewLog`-এ লগ করা হয়। rate-limiting আরও কড়া করা বা view-count
  ভিত্তিক abuse detection এখনো যোগ করা হয়নি।
- ইমেইল ভেরিফিকেশন (mandatory) ইচ্ছাকৃতভাবে বন্ধ রাখা হয়েছে, যেহেতু
  বেশিরভাগ ডোনারের placeholder ইমেইল থাকবে যা verify করা সম্ভব না।
