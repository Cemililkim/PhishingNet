# 🛡️ PhishingNet

> **Is this email legitimate, or a phishing attempt? Let's find out in seconds.**

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Features-→-6366f1?style=for-the-badge" alt="Features"></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick%20Start-→-22c55e?style=for-the-badge" alt="Quick Start"></a>
  <a href="#-api"><img src="https://img.shields.io/badge/API-→-f59e0b?style=for-the-badge" alt="API"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue" alt="License">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" alt="Status">
  <img src="https://img.shields.io/badge/Open%20Source-100%25-brightgreen" alt="Open Source">
</p>

---

## 🎯 What is PhishingNet?

PhishingNet is a **free, open-source email security platform** that helps users verify whether an email is genuine or a phishing attempt. 

Unlike traditional tools that show cryptic technical data, PhishingNet explains results in **plain human language** — no cybersecurity degree required.

### ✨ Key Differentiators

| Traditional Tools | PhishingNet |
|-------------------|-------------|
| ❌ Closed-source, opaque | ✅ 100% open-source |
| ❌ Technical jargon only | ✅ Plain language explanations |
| ❌ No learning context | ✅ Educational insights |
| ❌ Expensive or limited | ✅ Free & community-driven |

---

## 🚀 Features

### 📧 Email Analysis
- **Quick Scan** — Paste an email address for instant domain analysis
- **Deep Inspection** — Upload `.eml` files for full header parsing
- **Header Analysis** — Paste raw headers for technical deep-dives

### 🔐 Security Checks
- **SPF Validation** — Verify authorized sending servers
- **DKIM Verification** — Check email signature integrity  
- **DMARC Enforcement** — Validate domain policy compliance
- **Domain Intelligence** — Age, reputation, lookalike detection

### 🤖 AI-Powered Analysis
- **Content Scanning** — Detect urgency tactics, financial lures, impersonation
- **Privacy-First** — Analyze then discard, no email storage
- **Dual Models** — Fast screening + deep analysis

### 👥 Community Features
- **Report Phishing** — Submit suspicious domains (login required)
- **Vote on Reports** — Upvote/downvote to validate accuracy
- **Trust Levels** — Community consensus determines credibility

---

## 🏁 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/PhishingNet.git
cd PhishingNet

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI (Groq)
GROQ_API_KEY=gsk_your_key_here

# Optional
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
```

---

## 📡 API

PhishingNet provides a REST API for programmatic access.

### Analyze Email

```bash
curl -X POST https://api.phishingnet.dev/analyze/email \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "sender@example.com"}'
```

### Response

```json
{
  "status": "success",
  "data": {
    "risk_score": 15,
    "verdict": "safe",
    "checks": {
      "spf": "pass",
      "dkim": "pass", 
      "dmarc": "pass"
    },
    "explanation": "This email passed all security checks."
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4 |
| AI | Groq SDK, Llama 3.x |
| Database | Supabase (PostgreSQL) |
| Testing | Jest, Playwright |

---

## 📂 Project Structure

```
PhishingNet/
├── app/                # Next.js pages & API routes
├── components/ui/      # Reusable UI components
├── lib/types/          # TypeScript types
├── tests/              # Jest & Playwright tests
└── docs/               # Documentation
```

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/PhishingNet.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm test

# Push and create PR
git push origin feature/amazing-feature
```

---

## 💚 Community & Sustainability

> **This project is free and community-driven.**  
> If usage grows significantly, sustainability options may be evaluated.

We believe email security should be accessible to everyone. PhishingNet is built by the community, for the community.

---

## 📜 License

PhishingNet is open-source software licensed under the [Apache License 2.0](LICENSE).

```
Copyright 2025 PhishingNet Contributors

Licensed under the Apache License, Version 2.0
```

---

## 🔒 Security

Found a vulnerability? Please report it responsibly:

- **Email**: security@phishingnet.dev
- **Response Time**: 24-48 hours

---

<p align="center">
  <strong>🛡️ Built to fight phishing — openly and collaboratively.</strong>
</p>

<p align="center">
  Made with ❤️ by the open-source community
</p>
