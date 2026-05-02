# Job Fair 2026 — Railway Config & Environment Variables

## 1. backend/railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

## 2. backend/Dockerfile (alternative to nixpacks)
```dockerfile
FROM python:3.11-slim

# Install system deps for Pillow (image processing)
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway injects $PORT at runtime
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

> [!IMPORTANT]
> If using the Dockerfile approach, change `railway.toml` to:
> ```toml
> [build]
> builder = "dockerfile"
> dockerfilePath = "Dockerfile"
> 
> [deploy]
> restartPolicyType = "on_failure"
> restartPolicyMaxRetries = 3
> ```

## 3. frontend/railway.toml
```toml
[build]
builder = "nixpacks"
buildCommand = "npm install && npm run build"

[build.nixpacksPlan.phases.setup]
nixPkgs = ["nodejs_22", "npm-10_x"]

[deploy]
startCommand = "npx vite preview --host 0.0.0.0 --port $PORT"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

> [!TIP]
> We use `vite preview` instead of `npx serve` because Vite is already
> a devDependency — no extra package needed. `vite preview` serves the
> `dist/` folder with SPA fallback built-in.

## 4. backend/.env.example
```env
# ─── Supabase ───
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGci...                    # service_role key (bypasses RLS)

# ─── JWT Auth ───
JWT_SECRET=your-random-32-char-secret-key
ADMIN_DEFAULT_EMAIL=admin@izeebschool.com
ADMIN_DEFAULT_PASSWORD=changeme123

# ─── Brevo HTTP API ───
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxx    # Brevo API key (NOT SMTP password)
BREVO_SENDER_EMAIL=noreply@izeebschool.com
BREVO_SENDER_NAME=IZEE Job Fair 2026

# ─── CORS ───
FRONTEND_URL=https://your-frontend.up.railway.app
RAILWAY_FRONTEND_URL=https://your-frontend.up.railway.app

# ─── Staff On-Spot Key ───
STAFF_PASSWORD=onspot2026
```

## 5. frontend/.env.example
```env
# All frontend env vars MUST start with VITE_ prefix
VITE_API_URL=http://localhost:8000
```

## 6. frontend/.env.production
```env
VITE_API_URL=https://your-backend.up.railway.app
```

---

## Environment Variables Reference Table

### Backend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_KEY` | ✅ | Supabase **service_role** key (NOT anon) |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `BREVO_API_KEY` | ✅ | Brevo API key (`xkeysib-...`) — NOT SMTP password |
| `BREVO_SENDER_EMAIL` | ✅ | From address for emails |
| `BREVO_SENDER_NAME` | ✅ | From name for emails |
| `FRONTEND_URL` | ✅ | Frontend Railway URL (for CORS) |
| `STAFF_PASSWORD` | ✅ | On-spot registration guard |
| `PORT` | Auto | Injected by Railway at runtime |

### Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |

> [!WARNING]
> **Vite requires the `VITE_` prefix.** Any env var without this prefix will NOT be available in frontend code. This is a common deployment failure point.

---

## Railway Deployment Steps

### Initial Setup
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Link to your repo
railway link
```

### Deploy Backend
```bash
cd backend
railway up
# Set env vars in Railway dashboard or CLI:
railway variables set SUPABASE_URL=...
railway variables set SUPABASE_KEY=...
# ... all vars from .env.example
```

### Deploy Frontend
```bash
cd frontend
railway up
# Set env var:
railway variables set VITE_API_URL=https://your-backend.up.railway.app
```

### Post-Deploy Checklist
1. ✅ Backend health check: `GET /health` returns `{"status": "ok"}`
2. ✅ Frontend loads at Railway URL
3. ✅ CORS: frontend can call backend without errors
4. ✅ Supabase: test a registration submission
5. ✅ Brevo: test email sending (check spam folder)
6. ✅ QR Scanner: test on mobile phone browser

## requirements.txt
```
fastapi==0.136.0
uvicorn[standard]==0.44.0
supabase==2.28.3
python-dotenv==1.2.2
Pillow==12.2.0
qrcode==8.2
python-jose[cryptography]==3.5.0
bcrypt==5.0.0
passlib[bcrypt]==1.7.4
httpx==0.28.1
python-multipart==0.0.26
pydantic==2.13.3
```

## vite.config.js
```javascript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://127.0.0.1:8000'
  
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        }
      }
    }
  }
})
```
