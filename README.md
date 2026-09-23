# 🪔 Find My Garba Partner (શોધો ગરબા પાર્ટનર) 💃🕺

> **Gujarat's Premier Navratri Partner Matching & Community Platform**  
> *Connecting Solo Dancers, Duos, and Garba Circles across Vadodara, Ahmedabad, Surat, Rajkot, and all of Gujarat.*

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Navratri 2026](https://img.shields.io/badge/Navratri-2026-orange.svg)]()
[![Platform: Gujarat](https://img.shields.io/badge/Region-Gujarat%2C%20India-gold.svg)]()

---

## 🌟 Key Features

1. **🎭 Authentic 3-Step Festive Registration Flow**:
   - Clean, mobile-first responsive UI with authentic bandhani and festive gold accents.
   - 2-Tier Location Selector: Gujarat's 12 primary urban hubs + dynamic neighborhood hotspot chips (Alkapuri, SG Highway, Vesu, Kalawad Road, etc.) and custom town/village support.
   - Style preferences: Dodhiya, Popat / Heench, Tran Tali, Dandiya Raas, Free Style.
   - Interactive 9-night Navratri availability picker.

2. **⚡ Automated Batch Matching Engine**:
   - Compatibility scoring algorithm matching dancers on **Night Availability Overlap**, **Garba Style**, **Locality/Neighborhood proximity (+30 bonus)**, and **Solo/Group preferences**.
   - Supports 1-on-1 pairs and micro-groups (3-4 dancers).
   - Automated Pre-Navratri cron scheduling (`node-cron`).

3. **💬 Masked In-App Direct Chat & Safety**:
   - Real-time Socket.io chat between confirmed mutual matches.
   - Privacy DTO masks phone numbers (`+91 ****** 1234`) and keeps identity secure until both users mutually agree.
   - 1-Click safety reporting and instant match pool ejection for flagged accounts.

4. **🛡️ Dedicated Admin Control Panel (`/admin/dashboard`)**:
   - Real-time KPI Metric cards (Total Users, Matched Dancers, Pending Unmatched, Top Active City).
   - City-wise match monitoring matrix with multi-criteria filtering.
   - Profile inspector (reveals unmasked phone and Instagram verification handles for admins).
   - Manual overrides: Break active matches or manually pair specific pending dancers.
   - 1-Click **Export Matches to CSV** (`GET /api/admin/export-matches`).

5. **📈 Privacy-Preserving Growth Analytics & Viral Referrals**:
   - Non-PII event logging (`Page_View`, `Form_Step_Completed`, `Registration_Success`, `UPI_QR_Clicked`).
   - Registration conversion funnel tracking (Step 1 $\rightarrow$ Step 3).
   - 1-Click customized WhatsApp viral referral link generator.
   - User feedback and suggestion submission box with dedicated admin inbox.

6. **☁️ Cloud-Ready & Free Tier Optimized**:
   - Lightweight health-check endpoint (`GET /api/health`).
   - Integrated keep-alive service preventing 15-minute idle spin-downs on Render free tier.
   - Zero-cost Infrastructure-as-Code blueprint (`render.yaml`).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express 4, MongoDB Atlas (Mongoose 8), Socket.io, JWT Authentication, Helmet, Rate Limiter, Express-Mongo-Sanitize, Node-Cron.
- **Frontend**: React 18, Vite 5, Lucide Icons, Custom Navratri CSS Glassmorphism Design System.
- **DevOps & Cloud**: Render Web Services (`render.yaml`), Cloudflare Quick Tunnels.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance

### 2. Installation & Setup
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Harshil7104/abcdforgarbaandnavratri.git
cd abcdforgarbaandnavratri

# Install backend dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

### 3. Configure Environment Variables
Copy the `.env.example` file and configure your credentials:
```bash
cp .env.example .env
```
Edit `.env` with your MongoDB connection string and JWT secret:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/garba-partner?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_garba_2026
CLIENT_URL=http://localhost:5173
```
*(Note: If your MongoDB password has special characters like `@`, URL-encode them as `%40`)*

### 4. Seed Authentic Gujarat Demo Profiles (Optional)
```bash
npm run seed
```
Creates 38+ realistic Garba enthusiast profiles across Vadodara, Ahmedabad, Surat, and Rajkot.

### 5. Create / Promote Admin User (Optional)
```bash
npm run make-admin
```
Creates master admin account with credentials:
- **Phone**: `9999999999`
- **Password**: `AdminGarba@2026`

### 6. Run Both Backend and Frontend Concurrently
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 📱 Mobile Testing via Cloudflare Tunnel
To test on real mobile devices (iOS & Android) without ngrok sign-ups:
```bash
npm run tunnel
```
Spawns a public HTTPS URL (e.g. `https://random-subdomain.trycloudflare.com`) with instant QR code.

---

## ☁️ Deployment on Render

1. Push this repository to your GitHub account.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Select this repository — Render will automatically configure the build and start commands from [render.yaml](render.yaml).
5. Set `MONGO_URI` in the environment variables prompt.
6. Click **Apply**.

---

## 📜 License
This project is licensed under the ISC License.

---
*Jay Mataji! 🪔 Happy Navratri 2026!*
