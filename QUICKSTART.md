# SafeRouteAI - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Start Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

✅ Backend running at http://localhost:8000

### Step 2: Start Frontend
```bash
cd app
npm install
npm run dev
```

✅ Frontend running at http://localhost:3000

### Step 3: Open Browser
Navigate to http://localhost:3000

You should see a phone-framed web app with the SafeRouteAI interface!

## 📱 Demo Script (For Judges)

### Scene 1: Safety Heatmap (30 seconds)
1. Open the app
2. Point out the **Home screen** with the interactive map
3. Explain the color coding:
   - 🟢 Green = Safe (71-100)
   - 🟡 Yellow = Moderate (31-70)
   - 🔴 Red = Unsafe (0-30)
4. Click on a zone to show the safety score popup
5. Mention: "The map updates every 10 seconds with real-time data"

### Scene 2: Route Comparison (45 seconds)
1. Click **Route** tab in bottom navigation
2. Show the pre-filled coordinates (or enter custom ones)
3. Click **"Find Safe Route"**
4. Point out the two routes on the map:
   - Solid green line = Safe route
   - Dashed yellow line = Fast route
5. Highlight the safety scores for each route
6. Read the recommendation aloud

### Scene 3: Incident Reporting (30 seconds)
1. Click **Report** tab
2. Select an incident type (e.g., "Robbery")
3. Add a description
4. Click **"Use Current Location"** (or use default)
5. Click **"Submit Report"**
6. Show the success message
7. Immediately switch to **Feed** tab to show the incident appeared

### Scene 4: Live Feed (20 seconds)
1. Already on **Feed** tab
2. Scroll through recent incidents
3. Point out timestamps ("2m ago", "5h ago")
4. Mention: "Feed auto-refreshes every 5 seconds"

### Scene 5: Emergency Features (20 seconds)
1. Click **SOS** tab (red icon)
2. Show the emergency buttons:
   - SOS Alert
   - Call Police
   - Flashlight
   - Share Location
3. Scroll down to show emergency contact numbers
4. Say: "In a real emergency, these would trigger actual device features"

### Closing Statement (15 seconds)
"SafeRouteAI uses a rule-based AI scoring system that considers **traffic, lighting, weather, crowd density, recent incidents, and police proximity** to calculate real-time safety scores from 0-100. This helps Lagos residents make informed decisions about their routes and stay safe."

**Total Demo Time: ~2.5 minutes**

## 🎯 Key Talking Points

### Technical Highlights
- ✅ **6 REST API endpoints** (FastAPI)
- ✅ **Rule-based safety scoring** (no ML training needed)
- ✅ **Real-time updates** (10-second polling)
- ✅ **SQLite database** for persistence
- ✅ **Responsive phone frame UI** (looks like mobile app)
- ✅ **Interactive maps** (Leaflet + OpenStreetMap)

### Impact Story
- 🌍 **Problem**: Lagos residents don't have real-time safety information
- 💡 **Solution**: Community-driven safety scoring and routing
- 📈 **Scale**: Can expand to other Nigerian cities
- 🤝 **Community**: User-reported incidents create collective awareness

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure you're in the backend directory
cd backend

# Try installing dependencies again
pip install --upgrade pip
pip install -r requirements.txt

# Run with verbose output
python main.py
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps if needed
npm install --legacy-peer-deps
```

### Map not showing
- Check browser console for errors
- Ensure backend is running (map needs heatmap data)
- Try refreshing the page

### CORS errors
- Backend has CORS enabled for all origins
- If issues persist, check backend console logs

## 📊 Sample Data

The backend automatically generates:
- **25 safety zones** across Lagos
- **15 initial incidents** (last 48 hours)
- **20 IoT sensor readings**

Data refreshes and updates as you use the app!

## 🎨 Customization

### Change Lagos to another city
Edit `backend/data_generator.py`:
```python
LAGOS_CENTER = {"lat": YOUR_LAT, "lng": YOUR_LNG}
LAGOS_BOUNDS = {
    "min_lat": MIN_LAT, "max_lat": MAX_LAT,
    "min_lng": MIN_LNG, "max_lng": MAX_LNG
}
```

### Adjust safety scoring weights
Edit `backend/safety_engine.py`:
```python
WEIGHTS = {
    "traffic": 0.15,
    "lighting": 0.25,
    # ... adjust as needed
}
```

## 🚢 Quick Deploy

### Backend to Railway
```bash
cd backend
railway init
railway up
```

### Frontend to Vercel
```bash
cd app
npm run build
vercel --prod
```

Don't forget to update `API_BASE_URL` in `app/src/services/api.js` after deploying backend!

---

**Good luck with your demo! 🎉**
