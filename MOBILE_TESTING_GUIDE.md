# Mobile Testing & Tunneling Guide 📱
**Find My Garba Partner** ([findmygarbapartner.com](https://findmygarbapartner.com))

This guide explains how to test the responsive registration form, user dashboard, masked chat, and UPI payment buttons directly on physical smartphones (iOS / Android) using local tunnels.

---

## 🚀 1. Start Development Servers

Run the monorepo dev command from `c:\GARBA PROJECT`:

```bash
npm run dev
```

This starts both services simultaneously:
- **Backend API & Socket.io**: `http://localhost:5000`
- **React Vite Frontend**: `http://localhost:5173`

---

## 🌐 2. Exposing to Mobile (Option A: Ngrok - Recommended)

### Step 1: Install Ngrok
Download from [ngrok.com](https://ngrok.com) or install via npm/winget:
```bash
npm install -g ngrok
# or on Windows:
winget install ngrok.ngrok
```

### Step 2: Authenticate Ngrok
```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

### Step 3: Expose Frontend & Backend

**Terminal 1 (Expose React Client):**
```bash
ngrok http 5173
```
*Ngrok will output a public HTTPS URL (e.g., `https://abc-123.ngrok-free.app`).*

**Terminal 2 (Expose Express Backend if tested on separate host):**
```bash
ngrok http 5000
```

---

## ⚡ 3. Exposing to Mobile (Option B: LocalTunnel - 100% Free & No Account Required)

If you don't have an Ngrok account, use LocalTunnel instantly without signing up:

```bash
npx localtunnel --port 5173
```
*Output:* `your url is: https://garba-partner-test.loca.lt`

---

## 📲 4. Open and Test on Mobile

1. Copy the generated HTTPS tunnel URL (e.g. `https://abc-123.ngrok-free.app`).
2. Generate a QR code in your terminal or browser:
   - On Windows: Use Chrome/Edge address bar -> Click **"Create QR Code for this page"**.
3. Scan the QR code with your iPhone or Android camera to open the app on mobile.

---

## 🧪 Mobile Test Checklist:
- [ ] **Festive Theme & Toran**: Confirm responsive layout on 375px–430px screens.
- [ ] **3-Step Registration**: Register a test user with a 10-digit number.
- [ ] **UPI Donation Module**: Click the **"Pay ₹51 via UPI App (Mobile)"** button to confirm it triggers GPay, PhonePe, or Paytm deep-linking.
- [ ] **In-App Real-Time Chat**: Open chat with a matched partner and test real-time Socket.io message exchange.
- [ ] **WhatsApp Referral**: Tap **"Share on WhatsApp & Invite Friends"** to test WhatsApp group invitation pre-filled text.

---

## 🌱 5. Seed Mock Data for Instant Testing

To populate your database with 40+ authentic Gujarati dancers in Vadodara, Ahmedabad, Surat, and Rajkot:

```bash
npm run seed
```
*(Password for all seeded accounts: `garbaUser123`)*
