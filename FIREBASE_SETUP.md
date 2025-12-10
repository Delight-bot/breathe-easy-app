# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `breathe-easy-app` (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (optional) or configure it
6. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click the web icon `</>` to add a web app
2. Register app with nickname: "Breathe Easy Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need this!

```javascript
// It will look like this:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Click on "Sign-in method" tab
4. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in **test mode**" (for development)
   - **Note:** Change to production mode before deploying!
4. Choose a Firestore location (select closest to your users)
5. Click "Enable"

## Step 5: Set Up Firestore Security Rules (Important!)

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only read/write their own symptom logs
    match /symptomLogs/{logId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Users can only read/write their own questionnaire data
    match /questionnaires/{questionnaireId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Federated learning data - anonymized, no personal info
    match /federatedData/{docId} {
      // Anyone authenticated can read (for community model training)
      allow read: if request.auth != null;

      // Can create only if NO personal identifiers present
      allow create: if request.auth != null
        && !request.resource.data.keys().hasAny(['userId', 'email', 'name', 'uid'])
        && request.resource.data.location is map
        && request.resource.data.conditions is map
        && request.resource.data.statistics is map;
    }
  }
}
```

3. Click "Publish"

## Step 6: Configure Your App

1. Open `src/firebase/config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Replace with your actual API key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try signing up a new user
3. Check Firebase Console > Authentication to see the new user
4. Check Firestore Database to see the user data

## Firestore Collections Structure

Your Firestore will have these collections:

### `users` collection
```
users/{userId}
  - name: string
  - email: string
  - avatar: object
  - createdAt: timestamp
  - updatedAt: timestamp
```

### `symptomLogs` collection
```
symptomLogs/{logId}
  - userId: string
  - symptom: string
  - severity: string
  - trigger: string
  - notes: string
  - timestamp: timestamp
  - date: string
  - time: string
```

### `questionnaires` collection
```
questionnaires/{questionnaireId}
  - userId: string
  - hasAsthma: string
  - hasCOPD: string
  - hasAllergies: string
  - ... other questionnaire fields
  - createdAt: timestamp
  - updatedAt: timestamp
```

### `federatedData` collection (Anonymized ML Data)
```
federatedData/{docId}
  - location: { lat, lng, region } (rounded to 10km grid)
  - conditions: { hasAsthma, hasCOPD, hasAllergies }
  - statistics: {
      aqiCategory: {
        avgSeverity: number,
        count: number,
        commonTriggers: array
      }
    }
  - timestamp: timestamp
  - dataPoints: number
  - modelVersion: string

⚠️ NO userId, name, or email - fully anonymized!
```

## Machine Learning Features

The app uses **Federated Learning** with TensorFlow.js for privacy-preserving AI predictions:

### Three-Tier Prediction System

1. **Rule-Based** (0-9 logs): Basic predictions using medical guidelines
2. **Community Model** (0-9 logs): AI trained on anonymized data from nearby users
3. **Personal Model** (10+ logs): AI trained on your personal symptom history

### Privacy-Preserving Federated Learning

- ✅ **Anonymized data sharing**: Only aggregated statistics, never raw logs
- ✅ **Location privacy**: Coordinates rounded to ~10km grid
- ✅ **No personal identifiers**: No userId, name, or email shared
- ✅ **Community benefit**: New users get AI predictions immediately
- ✅ **Local training**: Models run in your browser, not on servers

### How It Works

1. **User logs symptoms** → Stored privately in Firestore
2. **After 10 logs** → Anonymized statistics uploaded to `federatedData`
3. **New users** → Fetch anonymized community data for similar conditions
4. **AI trains locally** → Neural network learns patterns in browser
5. **Predictions** → Personalized recommendations based on AQI + conditions

See **ML_ARCHITECTURE.md** for detailed technical documentation.

## Production Deployment Checklist

Before deploying to production:

- [ ] Change Firestore rules from test mode to production mode
- [ ] Set up Firebase billing (required for production)
- [ ] Enable email verification for new users
- [ ] Set up password reset functionality
- [ ] Configure authorized domains in Firebase Authentication
- [ ] Set up Firebase Hosting or deploy to your hosting provider
- [ ] Enable Firebase Analytics (optional)
- [ ] Set up error monitoring (Firebase Crashlytics or Sentry)

## Troubleshooting

### "Firebase not initialized" error
- Make sure you've updated `src/firebase/config.js` with your actual config

### "Permission denied" errors in Firestore
- Check your Firestore security rules
- Make sure user is authenticated before accessing data

### Authentication errors
- Verify Email/Password is enabled in Firebase Authentication
- Check browser console for specific error messages

## Support

For Firebase documentation: https://firebase.google.com/docs
For TensorFlow.js documentation: https://www.tensorflow.org/js
