# 🚀 Quick Deployment Instructions

## ⚠️ CRITICAL WARNING
**Your system time shows 2026. This WILL cause authentication failures in production.**
**Fix system time BEFORE deploying or your app will NOT work!**

---

## Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

### Step 1: Prepare Code
```bash
# Clean up (optional)
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_cmVmaW5lZC1waWdlb24tNzEuY2xlcmsuYWNjb3VudHMuZGV2JA
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
7. Click "Deploy"

### Step 3: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
6. Add Environment Variables (copy from backend/.env):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://knaveenkumar2424:1234@cluster0.doqebbg.mongodb.net/?appName=Cluster0
   JWT_SECRET=f4b366de20498982
   FRONTEND_URL=https://your-vercel-app.vercel.app
   CLERK_SECRET_KEY=sk_test_QOakEpH4BMv8tWq4D7YehlJm7YgDVs6KukGfbrdAzK
   CLERK_PUBLISHABLE_KEY=pk_test_cmVmaW5lZC1waWdlb24tNzEuY2xlcmsuYWNjb3VudHMuZGV2JA
   GEMINI_API_KEY=AIzaSyBOt4QCkdFmrdSO5pJ-qN4HxpMBHlM7Di4
   NODE_ENV=production
   ```
7. Click "Deploy"

### Step 4: Update URLs

After both are deployed:

1. **Get Railway backend URL** (e.g., `https://hospital-backend.railway.app`)
2. **Update Vercel environment variables:**
   - `VITE_API_URL` = `https://hospital-backend.railway.app/api`
3. **Update Railway environment variables:**
   - `FRONTEND_URL` = `https://your-app.vercel.app`
4. **Redeploy both** to apply changes

---

## Option 2: Deploy to Render (Both Frontend & Backend)

### Deploy Backend
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name:** hospital-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables (same as Railway above)
6. Click "Create Web Service"

### Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - **Name:** hospital-frontend
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add environment variables
5. Click "Create Static Site"

---

## Option 3: Deploy to Netlify (Frontend) + Render (Backend)

### Frontend (Netlify)
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Add environment variables
6. Deploy

### Backend (Render)
Same as Option 2 backend steps above.

---

## 🔧 Pre-Deployment Checklist

- [ ] **Fix system time to 2024/2025** ⚠️ CRITICAL
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas configured and accessible
- [ ] All API keys valid
- [ ] Environment variables ready
- [ ] CORS configured for production URLs
- [ ] Test locally one more time

---

## 📝 Post-Deployment Steps

1. **Test the deployed app:**
   - Open frontend URL
   - Try to register/login
   - Test all features
   - Check browser console for errors

2. **Update Clerk Dashboard:**
   - Add production URLs to allowed origins
   - Update redirect URLs

3. **Monitor:**
   - Check Railway/Render logs for errors
   - Monitor database connections
   - Watch for SSL/certificate errors

---

## 🆘 Troubleshooting

**Authentication fails:**
- Check Clerk keys are correct
- Verify allowed origins in Clerk dashboard
- **Fix system time if still 2026**

**CORS errors:**
- Update `FRONTEND_URL` in backend
- Update `VITE_API_URL` in frontend
- Redeploy both

**Database connection fails:**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Verify connection string

---

## ⚡ Quick Deploy Commands

If you have Vercel/Railway CLI installed:

```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
railway up
```

---

## 🎯 Recommended: Vercel + Railway

**Why:**
- ✅ Free tiers available
- ✅ Automatic deployments from GitHub
- ✅ Easy environment variable management
- ✅ Good performance
- ✅ SSL certificates included

**Cost:** $0/month (free tier)

---

## ⚠️ FINAL WARNING

**Before you deploy, you MUST:**
1. Fix system time to 2024/2025
2. Test authentication locally
3. Verify all features work

**If you deploy with system time = 2026:**
- Authentication will fail
- Users cannot log in
- App will be broken
- You'll waste time debugging

**Fix the time first, then deploy!** 🚀
