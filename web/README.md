# RoktoSetu — Frontend (web/)

পুরো প্রজেক্টের overview ও ডিপ্লয়মেন্ট গাইডের জন্য দেখুন: `../README.md`

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL বসান
npm install
npm run dev
```

## পেজসমূহ
- `/` — Homepage
- `/login`, `/register` — Better Auth দিয়ে auth
- `/forgot-password`, `/reset-password` — পাসওয়ার্ড রিসেট (শুধু real ইমেইল দেওয়া অ্যাকাউন্টে কাজ করে, `../README.md` দেখুন)
- `/search` — ডোনার সার্চ, লগইন করা থাকলে ফোন নম্বরসহ (`GET /api/users/search`)
- `/emergency` — জরুরি অনুরোধ দেখা, পোস্ট করা, নিজের অনুরোধ "সমাধান হয়েছে" মার্ক করা
- `/profile` — নিজের প্রোফাইল, "আজ রক্ত দিয়েছি" বাটন, রক্তদানের ইতিহাস
- `/admin` — অভেরিফায়েড ডোনার ভেরিফাই/রিমুভ (role: admin লাগবে)
