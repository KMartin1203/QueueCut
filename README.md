# ✂️ QueueCut
 
Real-time wait times powered by your community.

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```
 
### 2. Run locally
```bash
npm start
```
Opens at http://localhost:3000

### 3. Build for production
```bash
npm run build
```

---

## 📦 Project Structure

```
queuecut/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── index.js            # React entry point
│   ├── App.js              # Main app + navigation
│   └── components/
│       ├── Home.js         # Live wait times (user-facing)
│       └── PopularTimes.js # Data dashboard + pipeline
├── package.json
└── .gitignore
```

---

## 🌐 Deploy to Railway

1. Push this repo to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Select this repo
4. Railway auto-detects it as a React app
5. Your app goes live at a `.railway.app` URL

## 🌐 Deploy to Vercel (Alternative - Free)

1. Go to vercel.com → New Project → Import from GitHub
2. Select this repo → Deploy
3. Live in ~60 seconds

---

## 💰 Revenue Model
 
- **QueueCut Pro** – $4.99/mo (push alerts, history trends)
- **Business Listings** – $49–199/mo (verified wait times, dashboard)
- **Sponsored Placement** – pay to appear first in results
- **API Access** – sell data to navigation apps

---

## 🔧 Adding Real Data (Google Popular Times)

See the Data tab in-app for the full pipeline, or:

1. `pip install populartimes`
2. Get a Google Maps API key
3. Run the scheduler script (see `/src/components/PopularTimes.js`)
4. Connect to Supabase for storage
5. Deploy scheduler to Railway as a background worker
