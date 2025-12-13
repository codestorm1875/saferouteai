# Frequently Asked Questions (FAQ) ❓

### Q: How do you verify incident reports to prevent spam?
**A:** We use a multi-layered verification approach:
1.  **Location Check:** Users must be within a certain radius of the reported location.
2.  **Community Voting:** Other users can upvote (confirm) or downvote (deny) reports. Reports with net negative scores are hidden.
3.  **Trust Score:** Users build a "Reputation Score" over time. High-reputation users' reports are trusted more; low-reputation users are flagged.

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
