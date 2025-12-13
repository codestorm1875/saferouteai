import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PhoneFrame from './components/PhoneFrame';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import SafeRouteScreen from './screens/SafeRouteScreen';
import ReportScreen from './screens/ReportScreen';
import FeedScreen from './screens/FeedScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import TrendsScreen from './screens/TrendsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import './index.css';

function App() {
    const onboardingComplete = localStorage.getItem('saferouteai_onboarding_complete');

    return (
        <Router>
            <PhoneFrame>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomeScreen /> 
                        }
                    />
                    <Route path="/onboarding" element={<OnboardingScreen />} />
                    <Route path="/safe-route" element={<SafeRouteScreen />} />
                    <Route path="/report" element={<ReportScreen />} />
                    <Route path="/feed" element={<FeedScreen />} />
                    <Route path="/emergency" element={<EmergencyScreen />} />
                    <Route path="/trends" element={<TrendsScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/add-location" element={<AddLocationScreen />} />
                </Routes>
                <Navigation />
            </PhoneFrame>
        </Router>
    );
}

export default App;
