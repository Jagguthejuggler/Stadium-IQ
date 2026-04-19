# 🏟️ StadiumIQ Lite

StadiumIQ Lite is a smart crowd intelligence assistant designed to handle congestion logic at large-scale sports stadiums (like IPL/ISL events). By leveraging a **local, algorithmic decision engine** that requires no external AI APIs, it processes live zone-congestion metrics to dynamically output optimal pathfinding, the shortest queue recommendations, and smart alternatives.

## ⚠️ Problem Statement
During large-scale sporting events, massive influxes of fans lead to major bottlenecking at entry gates, food courts, and washroom corridors. Stagnant traffic decreases the spectator experience, presents safety hazards, and makes locating stadium amenities incredibly difficult under heavy structural load.

## 💡 Solution Overview
StadiumIQ Lite acts as a localized VIP assistant. It reads real-time or mocked density metrics across all major stadium zones and processes them through an internal logic heuristic. Instead of just displaying raw wait times, the **Cortex AI Engine** intelligently calculates the shortest time thresholds, dynamically overriding a user's standard seating path if an alternate gate would save them 20+ minutes of waiting.

### 🧠 Custom AI Decision Engine
The application explicitly avoids relying on pricey Generative AI APIs. All "smart" recommendations—including alternate gate bridging, queue parsing, and wait-time extrapolation—are handled locally via deterministic algorithms inside `decisionEngine.js`. 
- **Time Thresholds:** LOW (<5m), MEDIUM (~15m), HIGH (30m+)
- **Dynamic Override:** Navigation routes are safely overridden and recalculated if an intended gate hits critical mass.

## ✨ Features
1. **Live Sector Heatmap:** A visual array of glowing node tracking mapping the health of stadium sectors.
2. **Cortex AI Assistant:** Input your seat number or location to receive instant wayfinding recommendations.
3. **Quick Eats Express:** A built-in concession portal routing orders to the lowest-density food stalls with mocked Firebase connectivity.
4. **Operator View:** A separate administrative dashboard evaluating global metrics and granting the ability to deploy wide-scale push alerts.

## 🛠️ Tech Stack
- **Frontend Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS v4 (Glassmorphism + Dark Mode theme)
- **State & Routing:** Hooks, React Router DOM
- **Testing Engine:** Vitest
- **Containerization:** Docker (Multi-stage Node.js to Express serving `dist`)

## ☁️ Google Services Used
- Google Cloud Run (Containerized Deployment)
- Google Artifact Registry
- Firebase Realtime Database & Firestore (SDK integrated; defaults to local mocks if unauthenticated).

## 🚀 Setup Instructions

1. **Clone & Install:**
```bash
git clone https://github.com/Jagguthejuggler/Stadium-IQ.git
cd Stadium-IQ
npm install
```

2. **Firebase Linking (Optional):**
To replace the mock data with actual listeners, create a `.env` file at the root:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_id
```

3. **Start Development Server:**
```bash
npm run dev
```

## 🐳 Deployment (Google Cloud Run)
The repository is primed for Cloud Run using a Node.js Express static server wrap.

1. Authenticate with Google Cloud CLI.
2. Run standard deployment from source pointing to the pre-compiled `/dist` folder.
```bash
gcloud run deploy stadium-iq-lite --source . --port 8080 --region us-central1 --allow-unauthenticated
```

## 📋 Assumptions Made
- A full-scale backend dependency is unnecessary if Firebase handles the socket connections via Realtime DB.
- Cloud Run requires the UI to be served securely on port `8080`, handled gracefully without SSR bloat.

## 🌐 Live Demo
*Link to your Cloud Run URL here once fully provisioned!*
