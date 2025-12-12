# Setting Up Google Maps API Key

## Quick Setup

1. **Create a `.env` file** in the `app` directory:
```bash
cd app
cp .env.example .env
```

2. **Get your Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable **Maps JavaScript API** and **Places API**
   - Go to **Credentials** → **Create Credentials** → **API Key**
   - Copy your API key

3. **Add the key to `.env`**:
```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

4. **Update `index.html`**:
Replace `YOUR_API_KEY_HERE` in the Google Maps script tag with your actual API key:
```html
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places">
</script>
```

5. **Restart the dev server**:
```bash
npm run dev
```

## Without Google Maps API

If you don't have a Google Maps API key, the app will still work! The location search will just use manual coordinate input instead of autocomplete.

The maps (Leaflet) will work perfectly fine without Google Maps API.

## API Key Restrictions (Recommended)

For security, restrict your API key:
1. **Application restrictions**: HTTP referrers
   - Add: `http://localhost:3000/*`
   - Add your production domain when deploying

2. **API restrictions**: 
   - Maps JavaScript API
   - Places API

This prevents unauthorized use of your API key.
