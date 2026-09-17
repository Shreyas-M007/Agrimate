# 🌾 AgriMate

> **AI-Assisted Agricultural Market Intelligence Platform for Small & Marginal Farmers**
> Modern farming, verified APMC mandi rates, freight simulation, and produce realization.

---

## 📖 Overview

Small and marginal farmers often struggle to interpret complex agricultural market information (varying modal prices, minimum/maximum ranges, arrival volumes, grades, and disparate reporting dates across APMC yards).

**AgriMate** bridges this information gap by converting verified market data into simple, accessible, and actionable intelligence.

### 🛡️ Core Principle: Never Invent a Market Price
AgriMate operates under a non-negotiable data integrity constraint:
- **Numerical market data originates strictly from verified external sources** (Agmarknet / Directorate of Marketing & Inspection, Ministry of Agriculture, Govt. of India).
- If verified data is not available for a given crop and market, the application explicitly states that no verified data is available rather than guessing or extrapolating.
- **Amazon Bedrock / LLM layers serve strictly as an explanation and natural language translation layer**—they are never used to substitute or hallucinate numerical market data.

---

## ✨ Key Features

1. **Market Price Discovery & Comparison**:
   - Compares prevailing market rates across regional APMCs (e.g., Ballari, Kolar, Bangalore, Belagavi, Mysuru, Nashik, Pune, Guntur, Agra, Khanna, etc.).
   - Displays modal price, minimum and maximum range, price spread, arrival quantity, distance from user (via GPS or district search), and verified timestamp freshness.
   - Preserves comparative factors without oversimplifying into an artificial "best market" label.

2. **Multilingual by Default**:
   - Seamless one-tap language switching between **English**, **हिन्दी (Hindi)**, and **ಕನ್ನಡ (Kannada)** across all UI elements, educational guides, checklists, and AI insights.

3. **Smart Quantity Normalization**:
   - Accepts produce quantity in `kg`, `quintals (q)`, or `tonnes (t)` and normalizes automatically internally (e.g., `500 kg = 5 quintals = 0.5 tonnes`).

4. **Quantity Value Calculator**:
   - Calculates estimated gross value: `Normalized Quintals × Modal Price` (e.g. `5 quintals × ₹2,200 = ₹11,000`).
   - Labeled with the mandatory disclaimer: *Estimated gross value based on reported modal price, not guaranteed earnings.*

5. **Net Return In-Hand Estimator**:
   - Allows farmers to estimate net in-hand earnings by subtracting freight transportation costs, loading/unloading (hamali), and statutory APMC cess.

6. **Deterministic Price Trends**:
   - Computes real descriptive trends over 7, 15, and 30-day historical time series (price change, percentage change, period average, high, low).
   - Utilizes accessible symbols and text (`↑ Increasing`, `→ Stable`, `↓ Decreasing`) without relying on color alone.

7. **Bedrock AI Explanation Layer**:
   - Generates contextual, farmer-friendly explanations in the user's selected language grounded purely in retrieved verified facts.
   - Natural language query parser with speech-to-text input (e.g., *"500 kg tomato in Ballari"*, *"15 क्विंटल प्याज नासिक"*, *"ಬಳ್ಳಾರಿಯಲ್ಲಿ 500 ಕೆಜಿ ಟೊಮೆಟೊ"*).

8. **"Explain This" Agricultural Terminology Guide**:
   - Farmer-friendly analogies explaining *Modal Price*, *Minimum Price*, *Maximum Price*, and *Market Arrivals*.

9. **11-Step Farmer Selling Checklist**:
   - Interactive checklist covering pre-departure preparation, APMC gate entry, electronic weighbridge verification, fee breakdowns, and payment receipt confirmation, with print/save support.

10. **Offline & Low-Connectivity Resilience**:
    - Automatically caches recent searches in local storage with exact timestamps.
    - Clearly marks cached data with an offline warning banner.

---

## 🏗️ Architecture

```
Farmer Client (React 19 + TypeScript + Tailwind v4)
         │
         ▼
API Gateway / Express REST Backend
         │
    ┌────┴──────────────────────────┐
    ▼                               ▼
Verified APMC Dataset         Bedrock AI Layer
(Agmarknet / DMI Records)     (Grounded Explanations & NLP)
    │                               │
    └───────────────┬───────────────┘
                    ▼
Deterministic Math & Statistics (Zero Hallucination)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Shreyas-M007/Agrimate.git
cd Agrimate

# Install dependencies
npm --prefix server install
npm --prefix client install
```

### Running Locally

```bash
# Start backend server (port 5001)
npm run dev:server

# Start frontend dev server (port 5173 with API proxy)
npm run dev:client
```

Or build and serve full-stack on port 5001:
```bash
npm --prefix client run build
npm --prefix server start
```
Open **[http://localhost:5001](http://localhost:5001)** in your browser.

---

## 🧪 Automated Testing

Run the automated verification test suite:
```bash
npm test
```
Tests cover:
- Quantity normalization formulas (`kg`, `quintal`, `tonne`)
- Gross value & net return calculations
- Haversine distance estimation
- Data integrity & refusal to fabricate prices
- Deterministic price trend statistics & accessible symbols
- Multilingual AI explanation generation (EN, HI, KN)
- 11-step selling checklist integrity
- Natural language query parser

---

## 📄 License
MIT License. Built for small and marginal farmers.
