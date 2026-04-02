# ICOSYS - Deployment Guide (Render + Vercel)

Complete step-by-step guide to deploy your React + Node + MongoDB app.

## Prerequisites
- GitHub account with your repository pushed
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account with your connection string

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend Environment Variables

1. Update or create `.env` file in `backend/` directory:
   ```
   MONGO_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/icosys?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-change-this
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app (you'll update this after Vercel deployment)
   ```

2. Make sure `.env` is in `.gitignore` (do NOT commit secrets):
   ```
   echo ".env" >> .gitignore
   git add .gitignore
   git commit -m "Add .env to gitignore"
   ```

3. Commit the `.env.example` file (template for others):
   ```
   git add backend/.env.example
   git commit -m "Add backend environment template"
   git push
   ```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `icosys-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier
   - **Root Directory**: `backend`

5. Click **Advanced** and add environment variables:
   ```
   MONGO_URI = <your-mongodb-atlas-connection-string>
   JWT_SECRET = <generate-a-strong-random-string>
   FRONTEND_URL = https://your-vercel-app.vercel.app (placeholder for now)
   NODE_ENV = production
   ```

6. Click **Create Web Service**
7. Wait for deployment (2-3 minutes)
8. Copy your Render URL (format: `https://icosys-backend.onrender.com`)

### Step 3: Keep Backend Warm (Optional but Recommended)

Render spins down free-tier apps after 15 minutes of inactivity. Add a monitoring service:

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create a free account
3. Click **Add Monitor** and set:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://icosys-backend.onrender.com/api/dashboard`
   - **Check Interval**: 10 minutes
   - **Alert Contacts**: Your email

This pings your backend every 10 minutes to keep it active.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variables

1. Create/update `.env.production` in `frontend/` directory:
   ```
   REACT_APP_API_URL=https://icosys-backend.onrender.com/api
   ```

2. Keep `.env.local` for local development:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. Commit these files:
   ```
   cd frontend
   git add .env.production .env.local
   git commit -m "Add environment configuration for Vercel"
   git push
   ```

### Step 2: Create Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Select your repository
4. Configure the project:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Click **Advanced** and add **Environment Variables**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://icosys-backend.onrender.com/api`
   - **Environments**: Select all (Production, Preview, Development)

6. Click **Deploy**
7. Wait for build to complete (2-3 minutes)
8. Copy your Vercel URL (format: `https://icosys.vercel.app`)

### Step 3: Update Backend CORS

Now that you have both URLs, update Render environment variables:

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Select your **icosys-backend** service
3. Click **Environment** tab
4. Edit `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://icosys.vercel.app
   ```
5. Click **Save Changes** (automatic redeploy)

---

## Part 3: Verify Deployment

### Test Backend API
```bash
# Test dashboard endpoint
curl https://icosys-backend.onrender.com/api/dashboard

# Test login endpoint
curl -X POST https://icosys-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Test Frontend
1. Visit `https://icosys.vercel.app` in your browser
2. Try logging in with your credentials
3. Check browser DevTools Console (F12) for any API errors
4. Verify network requests are going to `https://icosys-backend.onrender.com/api`

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS errors in browser | Verify `FRONTEND_URL` in Render environment matches your Vercel URL exactly |
| 502 Bad Gateway | Check MongoDB connection string in Render environment variables |
| API calls timing out | MongoDB Atlas might have IP whitelist. Allow `0.0.0.0/0` for Render |
| White screen on Vercel | Check browser console for `REACT_APP_API_URL` not being set correctly |

---

## Part 4: CI/CD & Auto-Deploy

Both Render and Vercel automatically redeploy when you push to your GitHub repository:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Render and Vercel will automatically redeploy
```

---

## Part 5: MongoDB Atlas Setup (If Needed)

If MongoDB connection fails, ensure:

1. **IP Whitelist**: Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows Render to connect)

2. **Connection String**: Verify format in `.env`:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/icosys?retryWrites=true&w=majority
   ```

3. **Database Credentials**: Ensure username and password don't contain special characters causing encoding issues

---

## Part 6: Environment Variables Summary

### Backend (.env on Render)
```
MONGO_URI = mongodb+srv://user:pass@cluster.mongodb.net/icosys?retryWrites=true&w=majority
JWT_SECRET = generate-a-random-string-here
FRONTEND_URL = https://your-vercel-app.vercel.app
NODE_ENV = production
PORT = 5000
```

### Frontend (.env.production in Vercel)
```
REACT_APP_API_URL = https://your-render-app.onrender.com/api
```

---

## Part 7: Performance Optimization

### Frontend (Vercel)
- ✅ Automatic CDN caching enabled
- ✅ Static files cached for 1 year
- ✅ Dynamic content cached for 0 seconds (always fresh)

### Backend (Render)
- ⚠️ Free tier has limited resources
- Upgrade to **Starter plan** ($7/month) for:
  - Always-on (no spin-down)
  - Better performance
  - 512 MB RAM (vs 512 MB shared)

---

## Part 8: Monitoring & Debugging

### View Logs
- **Render**: Dashboard → Service → Logs tab
- **Vercel**: Dashboard → Project → Deployments → Logs

### Monitor Performance
- **Render**: Use UptimeRobot (see Part 1, Step 3)
- **Vercel**: Built-in analytics at vercel.com/analytics

### Test API Endpoints
Use a REST client or curl:
```bash
# Login to get token
curl -X POST https://icosys-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Use token to fetch products
curl https://icosys-backend.onrender.com/api/products \
  -H "Authorization: Bearer <your-token>"
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test all API endpoints
4. ✅ Set up monitoring (UptimeRobot)
5. ✅ Configure custom domain (optional)
6. ✅ Set up automatic backups for MongoDB

---

## Support & Troubleshooting

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **CORS Issues**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

Last Updated: April 2, 2026
