# 🚀 CogniSphere AI - Deployment Guide

## Quick Deploy Overview

This project is configured for easy deployment to modern hosting platforms.

### 📋 Deployment Stack

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas

---

## 1️⃣ Database Setup (MongoDB Atlas)

### Steps:
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **FREE M0 Cluster**
3. Create database user:
   - Username: `cognisphere_user`
   - Password: `[generate secure password]`
4. Network Access:
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://USERNAME:PASSWORD@CLUSTER/cognisphere`
   - Replace USERNAME and PASSWORD with your credentials

---

## 2️⃣ Backend Deployment (Render)

### Steps:
1. Sign up at [Render](https://render.com) with GitHub
2. Create **New Web Service**
3. Connect your repository
4. Configure:
   - **Name**: `cognisphere-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Environment Variables (Add in Render):
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=[paste your MongoDB Atlas connection string here]
JWT_SECRET=[paste generated secret here]
JWT_EXPIRES_IN=7d
GROQ_API_KEY=[paste your Groq API key here]
FRONTEND_URL=[paste your Vercel URL here]
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### ⏱️ First Deploy:
- Takes 5-10 minutes
- Backend URL: `https://your-project-name.onrender.com`
- **Save this URL** for frontend configuration

---

## 3️⃣ Frontend Deployment (Vercel)

### Steps:
1. Sign up at [Vercel](https://vercel.com) with GitHub
2. **Import Project** from your repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variable (Add in Vercel):
```env
VITE_API_URL=[paste your Render backend URL here]
```
*(Example: https://your-backend-name.onrender.com)*

### ⏱️ Deploy:
- Takes 2-3 minutes
- Frontend URL: `https://your-app-name.vercel.app`

---

## 4️⃣ Post-Deployment Configuration

### Update Backend CORS:
In Render dashboard, add/update environment variable:
```env
FRONTEND_URL=[paste your Vercel URL here]
```
*(Example: https://your-app-name.vercel.app)*

### Redeploy Backend:
- Render → Your Service → Manual Deploy

---

## ✅ Verify Deployment

1. **Backend Health Check:**
   - Visit: `https://your-backend-name.onrender.com/`
   - Should return: `{"message":"CogniSphere API Server"}`

2. **Frontend:**
   - Visit your Vercel URL
   - Try registering a new account
   - Test chat functionality

---

## 🔧 Troubleshooting

### Backend Issues:
- ✅ Check Render logs for errors
- ✅ Verify all environment variables are set
- ✅ Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Frontend Issues:
- ✅ Verify `VITE_API_URL` points to correct backend URL
- ✅ Check browser console for CORS errors
- ✅ Ensure backend `FRONTEND_URL` matches Vercel URL

### CORS Errors:
- ✅ Backend `FRONTEND_URL` must match frontend domain exactly
- ✅ Include `https://` in URLs (no trailing slash)

---

## 🎉 Success!

Your app is now live and ready to showcase!

### Update README:
Add your live URLs:
```markdown
🔗 **Live Demo**: https://your-app.vercel.app
📡 **API**: https://your-backend.onrender.com
```

---

## 💡 Pro Tips

1. **Free Tier Limitations:**
   - Render free tier sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds (cold start)
   - Consider Render paid tier ($7/month) for always-on

2. **Custom Domain:**
   - Vercel allows free custom domains
   - Add in Vercel → Settings → Domains

3. **Monitoring:**
   - Render provides logs and metrics
   - Vercel shows analytics and deployment history

4. **Auto-Deploy:**
   - Both platforms auto-deploy on git push to main
   - Perfect for continuous deployment workflow

---

## 📞 Support

If you encounter issues:
- Check platform documentation
- Review error logs in Render/Vercel dashboards
- Verify environment variables are correct
