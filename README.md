# 🔍 Business Exposure Checker

A one-page tool that lets business owners check if their domain is publicly exposed — powered by the **Shodan API**, with **PayU payment integration** for full PDF report delivery.

## Features
- Free domain scan (open ports, risk grade, top 2 issues)
- Full PDF report gated behind ₹199 PayU payment
- Test/Live PayU switch via environment variable
- Deployable to Vercel in minutes

## Tech Stack
- **Next.js 14** — frontend + API routes
- **Shodan API** — host info lookups (free, no query credits used)
- **PayU** — payment gateway (test + live)
- **Tailwind CSS** — styling
- **Puppeteer** — PDF generation (implement in `payment-success.js`)

---

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/supportaff/business-exposure-checker
cd business-exposure-checker
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your values:
```env
SHODAN_API_KEY=your_shodan_api_key
PAYU_MERCHANT_KEY=your_payu_key
PAYU_MERCHANT_SALT=your_payu_salt
PAYU_ENV=test           # Change to 'live' for production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run locally
```bash
npm run dev
```

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Set `PAYU_ENV=live` when ready for production

---

## PayU Test Credentials
Use PayU's test credentials from [PayU Dashboard](https://onboarding.payu.in) for sandbox testing.

---

## Environment Variable Reference

| Variable | Description |
|---|---|
| `SHODAN_API_KEY` | Your Shodan API key |
| `PAYU_MERCHANT_KEY` | PayU merchant key |
| `PAYU_MERCHANT_SALT` | PayU merchant salt |
| `PAYU_ENV` | `test` for sandbox, `live` for production |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL (no trailing slash) |

---

## Roadmap
- [ ] PDF report generation via Puppeteer
- [ ] WhatsApp delivery via WhatsApp Business API
- [ ] Email delivery via Resend
- [ ] Rescan subscription (₹799 for 6 months)
