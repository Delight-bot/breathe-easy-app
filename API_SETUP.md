# AQI API Integration Setup Guide

This app integrates with multiple free Air Quality Index (AQI) APIs to provide real-time air quality data.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get at least ONE API key** (WAQI recommended for global coverage)

3. **Add your API keys to `.env`**

4. **Restart the development server**

## API Providers

### 🌍 WAQI (World Air Quality Index) - **RECOMMENDED**

**Why choose WAQI:**
- ✅ Global coverage (15,000+ stations worldwide)
- ✅ Very generous free tier
- ✅ No credit card required
- ✅ Easy setup

**How to get your token:**
1. Visit https://aqicn.org/data-platform/token/
2. Enter your email and reason (e.g., "Personal health tracking app")
3. Check your email for the token
4. Add to `.env`: `VITE_WAQI_API_KEY=your_token_here`

**Limitations:**
- 1000 requests/minute (plenty for personal use)

---

### 🌡️ OpenWeatherMap Air Pollution API

**Why choose OpenWeatherMap:**
- ✅ Also provides weather data (bonus!)
- ✅ Good global coverage
- ✅ Well-documented

**How to get your API key:**
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Go to "API keys" section
4. Copy your API key
5. Add to `.env`: `VITE_OPENWEATHER_API_KEY=your_key_here`

**Limitations:**
- 60 calls/minute on free tier
- May take 10-15 minutes for API key to activate

---

### 🇺🇸 AirNow (EPA) - US Only

**Why choose AirNow:**
- ✅ Official EPA data (most accurate for US)
- ✅ Completely free
- ✅ No rate limits for reasonable use

**How to get your API key:**
1. Visit https://docs.airnowapi.org/
2. Click "Request an API Key"
3. Fill out the form (personal use)
4. Check email for approval (usually within 1 business day)
5. Add to `.env`: `VITE_AIRNOW_API_KEY=your_key_here`

**Limitations:**
- US locations only
- Updates once per hour

---

## How the App Uses APIs

The app uses a **fallback system** to ensure reliability:

1. **First tries WAQI** (best global coverage)
2. **Falls back to OpenWeatherMap** if WAQI fails
3. **Falls back to AirNow** if both fail (US only)
4. **Uses cached data** if all APIs fail (cached for 30 min)
5. **Shows demo data** if nothing else works

You only need **ONE API key** for the app to work, but having multiple provides redundancy.

## Features Using Real AQI Data

Once set up, these features will use real-time data:

✅ **AQI Card** - Shows current air quality with pollutant breakdown
✅ **Alert Banner** - Personalized alerts based on your conditions
✅ **Full-Screen Alerts** - Emergency notifications for dangerous air quality
✅ **Route Planning** - Finds routes with better air quality
✅ **Location Detection** - Auto-detects your location or uses questionnaire city

## Testing the Integration

1. **With API keys configured:**
   - Visit the dashboard
   - Allow location access when prompted
   - Check the AQI Card for real data
   - Click the test button to trigger alerts at different AQI levels

2. **Without API keys:**
   - App will show a warning banner
   - Falls back to demo data
   - All features still work for testing

## Geolocation

The app requests your browser location to automatically fetch local AQI data. If denied:
- Uses city from questionnaire
- Can manually enter location
- Falls back to demo data

## Privacy Note

- API keys are stored locally in `.env` (never committed to git)
- Location data is not stored on any server
- All API calls are made directly from your browser
- Check each API's privacy policy for their data handling

## Troubleshooting

**"Failed to fetch AQI data" error:**
- Check API key is correctly added to `.env`
- Restart dev server after adding keys
- Verify API key hasn't expired
- Check browser console for specific errors

**Location not detected:**
- Enable location services in browser
- Check browser permissions
- Enter city name manually as fallback

**API rate limits:**
- Free tiers are generous for personal use
- App caches data for 15-30 minutes to reduce calls
- Multiple APIs provide redundancy

## Production Deployment

For production, set environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Other hosts**: Check their documentation for environment variables

Never commit `.env` file to git!
