# BreatheEasy 🌬️

A comprehensive respiratory health monitoring application that helps users track air quality, log symptoms, and predict potential health impacts using AI-powered analytics.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.10-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.3.0-FFCA28?logo=firebase&logoColor=black)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22.0-FF6F00?logo=tensorflow&logoColor=white)

## 🌟 Features

### 🌡️ Air Quality Monitoring
- Real-time AQI (Air Quality Index) tracking
- Location-based air quality data
- Visual indicators and alerts for hazardous conditions
- Historical air quality trends

### 📝 Symptom Logging
- Detailed symptom tracking interface
- Date and time stamping
- Severity level indicators
- Pattern recognition over time

### 🤖 AI-Powered Predictions
- Machine learning models using TensorFlow.js
- Health condition forecasting based on environmental data
- Personalized risk assessments
- Predictive analytics for symptom triggers

### 📊 Exposure Impact Analysis
- Correlation between air quality and symptoms
- Visual data representations
- Long-term exposure tracking
- Personalized health insights

### 🔗 Device Integration
- Connect external air quality monitors
- Sync respiratory health devices
- Real-time data synchronization
- Multi-device support

### 👨‍⚕️ Care Team Connection
- Share health data with medical professionals
- Secure communication channels
- Appointment scheduling
- Health report generation

### 📚 Medical Resources
- Curated health information
- Research articles and guidelines
- Treatment recommendations
- Educational content

### 👤 User Profile Management
- Customizable health profiles
- Avatar selection
- Privacy settings
- Preference management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase account (for backend services)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/breathe-easy-app.git
cd breathe-easy-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **React Router DOM** - Navigation and routing
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Font Awesome** - Icon library

### Backend & Services
- **Firebase** - Authentication, database, and hosting
- **TensorFlow.js** - Machine learning and predictions

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
breathe-easy-app/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── AQICard.jsx
│   │   ├── AlertBanner.jsx
│   │   ├── AvatarSelector.jsx
│   │   ├── CareTeam.jsx
│   │   ├── ChatBot.jsx
│   │   ├── MLPrediction.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ShareDataModal.jsx
│   │   └── SymptomLog.jsx
│   ├── pages/             # Page components
│   │   ├── ConditionPredictor.jsx
│   │   ├── ConnectDevice.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Doctor.jsx
│   │   ├── ExposureImpacts.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── MedicalResources.jsx
│   │   ├── Profile.jsx
│   │   ├── QuestionnaireStep1.jsx
│   │   ├── QuestionnaireStep2.jsx
│   │   ├── QuestionnaireStep3.jsx
│   │   ├── Signup.jsx
│   │   └── SymptomLogger.jsx
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── public/                # Static assets
├── index.html             # HTML template
└── package.json           # Project dependencies

```

## 🎨 Key Features Explained

### Multi-Step Onboarding
New users go through a comprehensive questionnaire to personalize their experience:
- **Step 1**: Basic health information
- **Step 2**: Respiratory condition details
- **Step 3**: Environment and lifestyle factors

### Dashboard
Centralized hub showing:
- Current AQI levels
- Recent symptom logs
- Health predictions
- Quick access to all features

### Condition Predictor
Uses machine learning to:
- Analyze historical data
- Predict symptom likelihood
- Suggest preventive measures
- Provide personalized recommendations

## 🔐 Security & Privacy

- Firebase Authentication for secure user management
- HIPAA-compliant data handling practices
- End-to-end encryption for sensitive health data
- User-controlled data sharing preferences

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Air quality data provided by [EPA AirNow API](https://www.airnow.gov/air-quality-and-health/)
- Medical information curated from reputable health organizations
- Community contributors and testers

## 📧 Contact

For questions or support, please contact:
- Email: support@breatheeasy.app
- GitHub Issues: [Create an issue](https://github.com/yourusername/breathe-easy-app/issues)

## 🗺️ Roadmap

- [ ] Mobile app (iOS and Android)
- [ ] Wearable device integration
- [ ] Multilingual support
- [ ] Telemedicine integration
- [ ] Advanced ML models for better predictions
- [ ] Community features and forums
- [ ] Export data to PDF reports

---

**Made with ❤️ for better respiratory health**
