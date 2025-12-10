import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Track Air Quality',
      description: 'Monitor real-time air quality data',
      icon: 'fa-wind',
      route: '/dashboard'
    },
    {
      title: 'Log Symptoms',
      description: 'Record your respiratory symptoms',
      icon: 'fa-notes-medical',
      route: '/log-symptoms'
    },
    {
      title: 'Predict Conditions',
      description: 'AI-powered health predictions',
      icon: 'fa-brain',
      route: '/condition-predictor'
    },
    {
      title: 'Connect Device',
      description: 'Sync your health devices',
      icon: 'fa-link',
      route: '/connect-device'
    },
    {
      title: 'Exposure Impacts',
      description: 'Understand pollutant effects',
      icon: 'fa-chart-line',
      route: '/exposure-impacts'
    },
    {
      title: 'Medical Resources',
      description: 'Access health information',
      icon: 'fa-book-medical',
      route: '/medical-resources'
    },
    {
      title: 'Consult Doctor',
      description: 'Connect with your care team',
      icon: 'fa-user-doctor',
      route: '/doctor'
    },
    {
      title: 'Your Profile',
      description: 'Manage your settings',
      icon: 'fa-user',
      route: '/profile'
    }
  ];

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>BreatheEasy</h1>
        <p>Your Respiratory Health Companion</p>
      </header>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card" onClick={() => navigate(feature.route)}>
            <i className={`fas ${feature.icon} feature-icon`}></i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
