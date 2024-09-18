// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage'; // Import the LandingPage component
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import AutomationRules from './AutomationRules';
import DeviceControl from './DeviceControl';
import SmartDoor from './SmartDoor';
import CameraControl from './CameraControl';
import TVControl from './TVControl';
import WeatherControl from './WeatherControl';
import NotFound from './NotFound';  // Import the NotFound component
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} /> {/* Update to use LandingPage */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/automation-rules"
            element={isAuthenticated ? <AutomationRules /> : <Navigate to="/" />}
          />
          <Route
            path="/device-control"
            element={isAuthenticated ? <DeviceControl /> : <Navigate to="/" />}
          />
          <Route
            path="/smart-door"
            element={isAuthenticated ? <SmartDoor /> : <Navigate to="/" />}
          />
          <Route
            path="/camera-control"
            element={isAuthenticated ? <CameraControl /> : <Navigate to="/" />}
          />
          <Route
            path="/tv-control"
            element={isAuthenticated ? <TVControl /> : <Navigate to="/" />}
          />
          <Route
            path="/weather-control"
            element={isAuthenticated ? <WeatherControl /> : <Navigate to="/" />}
          />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

