# Frequently Asked Questions (FAQ) ❓

### Q: Since this is community-driven, how do you prevent users from posting fake information or gaming the system?
**A:** We treat data integrity as a security priority. We employ a **4-Layer Verification System** to filter out fake news and malicious actors:

1.  **Geofencing (Proof of Presence):** You cannot report an incident unless your device's GPS confirms you are physically within a 500m radius of the location. This prevents remote spamming.
2.  **Reputation Engine:** Every user starts with a neutral "Trust Score". Accurate reports earn points; flagged/false reports lose points. Reports from "High Trust" users appear instantly, while new accounts require community verification.
3.  **Community Consensus:** The "Waze Model" — reports are visible to nearby users who can Upvote (Confirm).
4.  **AI Anomaly Detection:** Our ML backend monitors for suspicious patterns (e.g., a single device sending 50 reports in 1 minute, or a sudden spike of reports in a historically quiet area with no corroborating social media signals). These are flagged for manual review.

### Q: Where do you get your initial data?
**A:** We bootstrap our data from:
1.  **Open Source Intelligence (OSINT):** News reports, Twitter feeds (e.g., @Gidi_Traffic).
2.  **Historical Data:** Public crime statistics and research papers on Lagos urban safety.
3.  **Simulation:** For the hackathon, we use a realistic data generator based on known Lagos hotspots (e.g., traffic in Apapa, nightlife in VI).

### Q: How is this different from Google Maps?
**A:** Google Maps optimizes for **speed** and **traffic**. SafeRouteAI optimizes for **personal safety**. We layer safety data (lighting, crime history, crowd density) on top of the map, which Google does not provide in this detail for Lagos. We are a *companion* to Google Maps, not a replacement for pure navigation.

### Q: What happens if there is no internet?
**A:** We have an **Offline Mode**. The app caches the latest safety heatmap and route data. While live updates won't work, users can still view the last known safety status of their area and access the Emergency Toolkit (Flashlight, SOS alarm).

### Q: Is user data private?
**A:** Yes. We are NDPR compliant. We do not track user movements. We only process location data when the app is open to provide alerts, and incident reports are anonymized. See [PRIVACY.md](PRIVACY.md) for details.

### Q: How is the "Safety Score" actually calculated? Is it arbitrary?
**A:** It is a precise, data-driven metric. We use a **Weighted Multi-Factor Algorithm** that processes 6 key signals in real-time:
*   **Street Lighting (25%):** Dark areas are penalized heavily.
*   **Historical Incident Rate (25%):** Past crime data.
*   **Real-Time Reports (20%):** Live user feedback.
*   **Crowd Density (10%):** "Eyes on the street" improves safety.
*   **Proximity to Security (10%):** Near police/security posts.
*   **Traffic Flow (10%):** Gridlock increases risk of "traffic robbery".
*   *Our ML engine then normalizes this score (0-100) to account for time-of-day variations.*

### Q: Can this system handle the scale of a megacity like Lagos (20M+ people)?
**A:** Yes. Our architecture is built for **Hyper-Scale**:
*   **Geo-Sharding:** The database is partitioned by Local Government Area (LGA), so a query in Ikeja doesn't slow down users in Lekki.
*   **Event-Driven:** We use an asynchronous queue system to handle thousands of concurrent reports without crashing.
*   **Edge Caching:** Safety scores are cached at the edge, ensuring map load times under 2 seconds even on 3G networks.

### Q: What about the "Digital Divide"? How do you reach non-smartphone users?
**A:** Safety is a right, not a luxury. Our roadmap includes **USSD & SMS Integration**:
*   Users with basic phones can dial a code (e.g., `*555*SAFE#`) to get a text summary of safety in their current location or report an emergency. This ensures we cover the 40% of Lagosians without smartphones.

### Q: How do you sustain the business without selling user data?
**A:** We have a robust **B2B Model**:
*   **Logistics API:** We sell "Safe Route" data to delivery companies (e.g., Jumia, DHL) to reduce cargo theft and insurance premiums.
*   **Real Estate Intelligence:** We provide safety ratings for property listing platforms.
*   *We prove that you can build a profitable tech unicorn while respecting user privacy.*
