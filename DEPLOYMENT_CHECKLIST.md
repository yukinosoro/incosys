name: Deployment Guide - Quick Checklist

## Before Deployment (Do This First)

### 0️⃣ **Pre-Deployment Setup**
- [ ] Push all code to GitHub
- [ ] Install Git locally (`git --version` to verify)
- [ ] Create accounts: Render.com, Vercel.com, MongoDB Atlas

---

### 1️⃣ **BACKEND (Render)**

#### Environment Variables Ready?
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/icosys...
JWT_SECRET=generate-random-string-here
FRONTEND_URL=https://yourapp.vercel.app (set after Vercel deployment)
NODE_ENV=production
PORT=5000
```

#### Render Deployment Steps
1. [ ] Go to render.com → Sign in with GitHub → **New Web Service**
2. [ ] Select your GitHub repository
3. [ ] Configure:
   - Name: `icosys-backend`
   - Runtime: `Node`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. [ ] Add all environment variables from above
5. [ ] Click **Create Web Service**
6. [ ] ⏳ Wait 2-3 minutes for deployment
7. [ ] 📋 Copy your Render URL: `https://icosys-backend.onrender.com`

#### MongoDB Atlas Configuration
- [ ] Go to MongoDB Atlas → Network Access
- [ ] Click **Add IP Address**
- [ ] Add: `0.0.0.0/0` (allows Render to connect)
- [ ] Confirm your MONGO_URI is in Render environment variables

---

### 2️⃣ **FRONTEND (Vercel)**

#### Environment Variables Ready?
```
REACT_APP_API_URL=https://icosys-backend.onrender.com/api
```

#### Vercel Deployment Steps
1. [ ] Go to vercel.com → Import Project from Git
2. [ ] Select your GitHub repository
3. [ ] Configure:
   - Framework: **React**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output: `build`
4. [ ] Click **Advanced** → Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://icosys-backend.onrender.com/api` (from Step 1.7)
5. [ ] Click **Deploy**
6. [ ] ⏳ Wait 2-3 minutes for build
7. [ ] 📋 Copy your Vercel URL: `https://yourapp.vercel.app`

---

### 3️⃣ **UPDATE BACKEND WITH FRONTEND URL**

1. [ ] Go back to Render Dashboard
2. [ ] Select **icosys-backend** → **Environment**
3. [ ] Edit `FRONTEND_URL` = your Vercel URL from Step 2.7
4. [ ] Click **Save** (auto-redeploys)

---

### 4️⃣ **VERIFY EVERYTHING WORKS**

#### Test Backend API
```bash
# Test if API is responding
curl https://icosys-backend.onrender.com/api/dashboard

# Login test
curl -X POST https://icosys-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

#### Test Frontend
- [ ] Visit your Vercel URL in browser
- [ ] Open DevTools (F12) → Console tab
- [ ] Try logging in
- [ ] Check Network tab → API requests should go to `icosys-backend.onrender.com`
- [ ] Verify NO CORS errors in console

#### Common Errors & Fixes
| Error | Fix |
|-------|-----|
| **CORS Error** | Update `FRONTEND_URL` in Render environment to match Vercel URL exactly |
| **502 Bad Gateway** | Check MongoDB connection string and IP whitelist (0.0.0.0/0) |
| **Login fails** | Check `JWT_SECRET` is set in Render environment |
| **Blank page** | Open console (F12), check for `REACT_APP_API_URL` issues |
| **Network timeout** | Render free tier spins down. Use UptimeRobot to keep it warm |

---

### 5️⃣ **OPTIONAL: Keep Backend Always-On**

Free-tier Render apps sleep after 15 minutes. To keep it running:

1. [ ] Go to uptimerobot.com → Create free account
2. [ ] Click **Add Monitor**
3. [ ] Set:
   - Type: HTTP(s)
   - URL: `https://icosys-backend.onrender.com/api/dashboard`
   - Interval: 10 minutes
4. [ ] Save → Render will ping your API every 10 minutes

---

### 6️⃣ **SET UP AUTO-DEPLOYMENT**

Both Render and Vercel auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Update deployment configs"
git push  # Automatic redeploy starts!
```

---

## 🎉 **YOU'RE LIVE!**

**Your app is now live at:**
- Frontend: `https://yourapp.vercel.app` ✅
- Backend: `https://icosys-backend.onrender.com` ✅
- Database: MongoDB Atlas ✅

---

## Quick Reference

**URLs After Deployment:**
```
Frontend URL: https://yourapp.vercel.app
Backend URL: https://icosys-backend.onrender.com
API Base: https://icosys-backend.onrender.com/api
```

**Environment Variables Locations:**
- Backend: Render Dashboard → Environment Tab
- Frontend: Vercel Project → Settings → Environment Variables

**Monitor Logs:**
- Render: Dashboard → Select Service → Logs Tab
- Vercel: Dashboard → Project → Deployments → Logs

---

For detailed guide, see: [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
