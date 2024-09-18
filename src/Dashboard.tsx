import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(''); // State to track the active tab

  // Function to handle tab clicks
  const handleTabClick = (tabName: string) => {
    setActiveTab(activeTab === tabName ? '' : tabName); // Toggle the tab on and off
  };

  return (
    <div className="dashboard">
      <h1>Welcome to the Smart Home Dashboard!</h1>
      <div className="dashboard-tabs">
        <button
          onClick={() => handleTabClick('weather')}
          className={`tab ${activeTab === 'weather' ? 'active' : ''}`}
        >
          Weather Control
        </button>
        <button
          onClick={() => handleTabClick('device')}
          className={`tab ${activeTab === 'device' ? 'active' : ''}`}
        >
          Device Control
        </button>
        <button
          onClick={() => handleTabClick('automation')}
          className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
        >
          Automation Rules
        </button>
        <button
          onClick={() => handleTabClick('camera')}
          className={`tab ${activeTab === 'camera' ? 'active' : ''}`}
        >
          Camera Control
        </button>
        <button
          onClick={() => handleTabClick('tv')}
          className={`tab ${activeTab === 'tv' ? 'active' : ''}`}
        >
          TV Control
        </button>
        <button
          onClick={() => handleTabClick('door')}
          className={`tab ${activeTab === 'door' ? 'active' : ''}`}
        >
          Smart Door Control
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'weather' && (
          <div className="tab-dropdown">
            <img src="/images/smart door (1).png" alt="Weather Logo" className="weather-logo" />
            <Link to="/weather-control">Adjust Weather Settings</Link>
          </div>
        )}
        {activeTab === 'device' && (
          <div className="tab-dropdown">
            <Link to="/device-control">Manage Devices</Link>
          </div>
        )}
        {activeTab === 'automation' && (
          <div className="tab-dropdown">
            <Link to="/automation-rules">Set Automation Rules</Link>
          </div>
        )}
        {activeTab === 'camera' && (
          <div className="tab-dropdown">
            <Link to="/camera-control">Manage Cameras</Link>
          </div>
        )}
        {activeTab === 'tv' && (
          <div className="tab-dropdown">
            <Link to="/tv-control">Control TV</Link>
          </div>
        )}
        {activeTab === 'door' && (
          <div className="tab-dropdown">
            <Link to="/smart-door">Manage Smart Door</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

