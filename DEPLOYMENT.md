# 🚀 HarmoniX ML API Deployment Guide

## Quick Deploy Options (Choose One)

### 1. 🚂 Railway (Recommended)
**Best for: ML apps with easy deployment**

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Select your HarmoniX repository
4. Railway will auto-detect and deploy the ML API
5. Your API will be available at: `https://your-app.railway.app`

### 2. 🤗 Hugging Face Spaces
**Best for: AI model showcases**

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Create new Space with Gradio
3. Upload `ml-api/app.py` and `ml-api/lightweight_main.py`
4. Add `ml-api/requirements_minimal.txt` as requirements
5. Your app will be live at: `https://huggingface.co/spaces/username/harmonix`

### 3. 🎨 Render
**Best for: Free hosting**

1. Go to [render.com](https://render.com)
2. Connect GitHub and select HarmoniX repo
3. Use the `render.yaml` configuration
4. Deploy as Web Service
5. API available at: `https://harmonix-ml-api.onrender.com`

## 🔧 Environment Variables

Set these in your deployment platform:

```bash
PORT=8000
PYTHONPATH=/app/ml-api
REACT_APP_ML_API_URL=https://your-deployed-api-url.com
```

## 🎯 Update Frontend

After deploying, update your local `.env` file:

```bash
REACT_APP_ML_API_URL=https://your-deployed-api-url.com
```

Then redeploy to GitHub Pages:
```bash
npm run deploy
```

## ✅ Verification

Test your deployed API:
```bash
curl https://your-api-url.com/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "HarmoniX MusicGen LoRA API"
}
```

## 🎵 Result

After deployment:
- ✅ GitHub Pages frontend works 24/7
- ✅ ML API works 24/7 
- ✅ Real MusicGen + LoRA available online
- ✅ Complete portfolio demo always accessible