import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import QuestionnaireStep1 from "./pages/QuestionnaireStep1";
import QuestionnaireStep2 from "./pages/QuestionnaireStep2";
import QuestionnaireStep3 from "./pages/QuestionnaireStep3";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SymptomLogger from "./pages/SymptomLogger";
import ConnectDevice from "./pages/ConnectDevice";
import MedicalResources from "./pages/MedicalResources";
import Doctor from "./pages/Doctor";
import ConditionPredictor from "./pages/ConditionPredictor";
import ExposureImpacts from "./pages/ExposureImpacts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/questionnaire/step1" element={<QuestionnaireStep1 />} />
        <Route path="/questionnaire/step2" element={<QuestionnaireStep2 />} />
        <Route path="/questionnaire/step3" element={<QuestionnaireStep3 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/log-symptoms" element={<SymptomLogger />} />
        <Route path="/connect-device" element={<ConnectDevice />} />
        <Route path="/medical-resources" element={<MedicalResources />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/condition-predictor" element={<ConditionPredictor />} />
        <Route path="/exposure-impacts" element={<ExposureImpacts />} />
      </Routes>
    </Router>
  );
}

export default App; 