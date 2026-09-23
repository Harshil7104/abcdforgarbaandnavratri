# Railway Production Deployment & Custom Domain Guide 🚀
**Find My Garba Partner** ([findmygarbapartner.com](https://findmygarbapartner.com))

---

## 1. Railway Environment Configuration

In your **Railway Project Dashboard** (`https://railway.app`):
1. Select your Service -> Go to the **Variables** tab.
2. Add the following Production Environment Variables:

| Variable Name | Recommended Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production optimizations, strict CORS, and SPA routing |
| `PORT` | *Auto-assigned by Railway* (Leave unset or defaults to 3000/8080) | Railway binds dynamically to `$PORT` |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/garba_db?retryWrites=true&w=majority` | MongoDB Atlas Production Connection URI |
| `JWT_SECRET` | `a9f4c3b7e8d1928475a6c8b9d0e1f234a5b6c7d8e9f0123456789abcdef01234` | High-entropy 64-character secret for signing JWTs |
| `JWT_EXPIRES_IN` | `30d` | JWT session lifespan |
| `CLIENT_URL` | `https://findmygarbapartner.com` | Primary production domain for CORS whitelist |

> 💡 **Generate a secure 64-character JWT secret via Terminal**:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 2. Deployment Architecture (Monorepo)

Railway uses the included `nixpacks.toml` and `railway.json` to automatically build and host both the Express backend and Vite React client within a single high-performance instance:

```
┌─────────────────────────────────────────────────────────────┐
│                    Railway Cloud Instance                   │
│                                                             │
│   HTTP Requests: findmygarbapartner.com                     │
│                                                             │
│   ├── GET /api/*         ──> Express REST Controllers       │
│   ├── WS /socket.io/*    ──> Socket.io Real-Time Server     │
│   └── GET /*             ──> Static React SPA (client/dist) │
└─────────────────────────────────────────────────────────────┘
```

### Build & Start Cycle
- **Build Phase**: `npm --prefix client install && npm --prefix client run build`
- **Start Phase**: `node server.js`
- **Healthcheck**: Railway polls `/api/health` before routing traffic.

---

## 3. Deploying via Railway CLI or GitHub

### Option A: Direct Deploy via GitHub (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete production deployment setup"
   git push origin main
   ```
2. In [Railway](https://railway.app), click **+ New** -> **GitHub Repo** -> Select `find-my-garba-partner`.
3. Railway will detect `nixpacks.toml`, build the React frontend, and boot the Express server automatically.

### Option B: Deploy via Railway CLI
1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
2. Login and Link project:
   ```bash
   railway login
   railway link
   ```
3. Deploy directly:
   ```bash
   railway up
   ```

---

## 4. Custom Domain & DNS Setup Guide

To link your purchased domain (`findmygarbapartner.com` or `findmygarbapartner.in` from GoDaddy / Hostinger / Namecheap / Cloudflare):

### Step 1: Add Domain in Railway
1. In Railway, open your Service -> **Settings** tab.
2. Scroll to **Networking** -> Click **Custom Domain**.
3. Enter your domain: `findmygarbapartner.com` (and `www.findmygarbapartner.com`).
4. Railway will provide you with a target CNAME address (e.g., `find-my-garba-partner.up.railway.app`).

### Step 2: Configure DNS Records in Your Registrar

Log in to your DNS provider (GoDaddy, Hostinger, Cloudflare, etc.) and add the following records:

#### Configuration for `www.findmygarbapartner.com`:
| Record Type | Host / Name | Target / Value | TTL |
|---|---|---|---|
| `CNAME` | `www` | `<your-service>.up.railway.app` | Automatic / 1 Hour |

#### Configuration for Apex Root (`findmygarbapartner.com`):
- **If using Cloudflare or DNS with CNAME Flattening (Recommended)**:
  | Record Type | Host / Name | Target / Value | TTL |
  |---|---|---|---|
  | `CNAME` | `@` | `<your-service>.up.railway.app` | Auto (Proxied / Flattened) |

- **If using GoDaddy / Hostinger Standard DNS**:
  - Set up **Domain Forwarding** from `findmygarbapartner.com` to `https://www.findmygarbapartner.com` (301 Permanent Redirect).
  - Add any `TXT` verification records if requested by Railway.

### Step 3: Automatic TLS / SSL Certificate
Railway automatically provisions and renews a free **Let's Encrypt SSL Certificate** for your custom domain within 2–10 minutes after DNS propagation.

---

## 5. Post-Deployment Verification Checklist

Once deployed, verify your live system using the automated verification tool:

```bash
node scripts/verify-deployment.js https://findmygarbapartner.com
```

### Manual Checks:
1. **Healthcheck Endpoint**:
   ```bash
   curl -i https://findmygarbapartner.com/api/health
   ```
   *Expected Response:* `HTTP 200 OK` with `{"status":"UP","message":"ok"}`.

2. **MongoDB Connection**:
   In Railway **Deploy Logs**, verify:
   `✅ MongoDB Connected successfully: cluster0-shard-00-00.mongodb.net`

3. **CORS Security Verification**:
   ```bash
   curl -i -H "Origin: https://unauthorized-domain.com" https://findmygarbapartner.com/api/health
   ```
   *Expected:* Blocked or no `Access-Control-Allow-Origin` header for unauthorized origins.

4. **Helmet Security Headers**:
   Verify the response contains:
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security`
   - `Content-Security-Policy`

5. **Static React SPA Catch-All**:
   Open `https://findmygarbapartner.com/dashboard` in a private browser window to confirm client-side routing loads the React application properly.
