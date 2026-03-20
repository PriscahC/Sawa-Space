# SawaSpace 🌿
### Haki. Kazi. Ustawi. — Rights. Work. Prosperity.

> **SawaSpace** is a women's economic empowerment platform built for working women in Kenya and East Africa. It combines AI-powered legal triage, a vetted job board, coaching and mentorship, and a salary comparison tool — accessible on web and via USSD on any phone.

---

## 🌍 Why SawaSpace

In Kenya, **1 in 3 working women** faces workplace discrimination. Fewer than **3% ever report it** — not because it didn't happen, but because they didn't know they had a case, couldn't afford a lawyer, and had nowhere safe to start.

SawaSpace closes that gap. From the moment a woman asks herself *"was what happened to me even legal?"* — SawaSpace is there.

---

## ✨ Features

### ⚖️ Haki — AI Legal Triage Assistant
- Describe what happened in plain language
- Haki classifies the incident against Kenyan law
- Returns a viability assessment, evidence checklist, and action pathway
- Grounded in the Employment Act 2007, Sexual Offences Act 2006, Constitution of Kenya Article 27, and NGEC Act 2011
- Live avatar interface powered by HeyGen
- Also accessible via **USSD \*384\*1#** — no smartphone or data required

### 💼 Jobs Board — Vetted Employers Only
- Companies listed only after passing an equity verification audit
- Mandatory salary ranges on every listing — no "competitive salary"
- Filters for remote, returnship-friendly, parental leave policies
- Equity badges: Verified, Returnship Program, Transparent Pay

### 🎓 Coaching & Mentorship
- Book sessions with vetted career coaches (KES-priced)
- Peer mentor matching — connect with women who navigated the same industry or challenge
- Filters by career stage, industry, and challenge type

### 📊 Salary Comparison Tool
- Anonymous pay gap checker
- Industry benchmarks for Kenya
- Percentile visualization

### 📋 Incident Tracker
- Confidential workplace discrimination logger
- Timeline view
- One-click bridge to Haki legal triage — logged incidents pre-fill the triage form

### 📚 Resources Hub
- Legal rights in Kenya
- Wealth building
- Salary negotiation
- Wellness and support

---

## 📱 USSD Access — \*384\*1#

SawaSpace is built for **every** woman — including the 73% of Kenyan women using feature phones without data bundles.

Dial **\*384\*1#** on any phone, any network to access:
- Legal triage in guided menu steps
- Rights information by category
- Free legal help contacts by county
- SMS summary sent after session ends

Built for Africa's Talking USSD gateway with Safaricom compatibility.

---

## 🤖 Haki — Live Avatar

Haki is SawaSpace's AI legal rights guide, deployed as a live talking avatar via HeyGen.

- Speaks English and Kiswahili
- Grounded in Kenyan labor law
- Warm, direct, and precise — 4 sentences maximum per response
- Always refers users to free legal help: FIDA Kenya, NGEC, County Labour Offices

Embed code:
```html
<iframe
  src="https://embed.liveavatar.com/v1/b02a18ed-4ab0-4353-8743-0e9f31cffde9"
  allow="microphone"
  title="Haki — SawaSpace Legal Rights Assistant"
  style="aspect-ratio: 16/9; width: 100%; border: none; border-radius: 16px;">
</iframe>
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| AI Legal Triage | Claude API (`claude-sonnet-4-20250514`) |
| Avatar | HeyGen Live Avatar |
| USSD | Africa's Talking USSD Gateway |
| SMS Fallback | Africa's Talking SMS API |
| Session State | Redis |
| Database | Supabase |
| Hosting | Vercel |

---

## ⚖️ Legal Framework

All AI responses are grounded exclusively in:

- **Employment Act 2007** (Cap 226) — dismissal, maternity rights, equal pay, contracts
- **Sexual Offences Act 2006** — workplace sexual harassment
- **Constitution of Kenya 2010, Article 27** — equality and non-discrimination
- **NGEC Act 2011** — gender discrimination complaints
- **Employment and Labour Relations Act 2004** — unfair labour practices
- **Occupational Safety and Health Act 2007** — hostile work environments

---

## 🆘 Free Legal Resources

SawaSpace always refers users to free help. These are embedded across the platform:

| Organization | Role | Contact |
|---|---|---|
| **FIDA Kenya** | Free legal representation for women | 0800 720 520 |
| **NGEC** | Gender discrimination complaints | 0800 720 419 |
| **ELRC** | Wrongful dismissal and pay disputes | elrc.go.ke |
| **County Labour Office** | Free mediation, every county | Visit in person |
| **GVRC** | Gender violence, 24hr support | 0719 638 006 |

---

## 💰 Business Model

| Tier | Who | What |
|---|---|---|
| **Free** | Individual women | Legal triage, incident tracker, resources |
| **Premium** | Individual women | Unlimited triage, lawyer matching, coaching |
| **Enterprise** | Employers | Equity audit, verified job board listing |
| **B2G** | NGOs & Government | Anonymised discrimination data, policy reports |

*Free for the women who need it most. Paid for by the institutions that owe them better.*

---

## 🗺️ Roadmap

- [x] MVP — Web platform with all five core features
- [x] Haki AI legal triage (Claude API)
- [x] USSD simulator
- [x] HeyGen live avatar integration
- [ ] USSD live deployment on Africa's Talking
- [ ] FIDA Kenya partnership
- [ ] Pilot with 3 Nairobi employers
- [ ] Kiswahili full translation
- [ ] 10,000 women served across Kenya

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/sawaspace/sawaspace.git

# Install dependencies
cd sawaspace
npm install

# Set up environment variables
cp .env.example .env
# Add your Claude API key, Africa's Talking credentials,
# HeyGen embed URL, and Supabase keys

# Run development server
npm run dev
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_claude_api_key
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_HEYGEN_EMBED_URL=https://embed.liveavatar.com/v1/b02a18ed-4ab0-4353-8743-0e9f31cffde9
```

---

## 🤝 Contributing

SawaSpace is built for East African women, by people who know this community. Contributions welcome — especially:

- Kiswahili translations
- Additional county-level legal resource data
- UI/UX improvements for low-bandwidth contexts
- USSD flow testing across networks

Please read `CONTRIBUTING.md` before submitting a pull request.

---

## 📄 Disclaimer

SawaSpace provides **legal information, not legal advice**. Haki is an AI assistant, not a lawyer. For legal advice specific to your situation, contact **FIDA Kenya: 0800 720 520** — free of charge.

---

## 👩🏾‍💻 Built By

**Priscila Adhiambo** — Founder, SawaSpace
Nairobi, Kenya 🇰🇪

Geospatial analyst, software developer, and AgriTech entrepreneur.
Founder of Outgrow | Smart Brains Kenya | Wogi Voices

> *"Every day a woman doesn't know her rights is a day someone gets away with violating them. SawaSpace ends that day."*

---

## 📬 Contact

- Website: [sawaspace.co.ke](https://sawaspace.co.ke)
- USSD: \*384\*1#
- Email: hello@sawaspace.co.ke
- Twitter/X: [@sawaspace](https://twitter.com/sawaspace)

---

<p align="center">
  <strong>Haki yako ni muhimu — Your rights matter.</strong><br/>
  <em>SawaSpace © 2025 · Nairobi, Kenya</em>
</p>
