import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './SmartDoor.css'; // External CSS for styling

// Define the expected response type
interface DoorControlResponse {
  message: string;
}

const SmartDoor: React.FC = () => {
  const [status, setStatus] = useState<string>('unlocked'); // Default status
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle the door action
  const handleDoorAction = async (action: string) => {
    setLoading(true);
    setError(null);
    setResponseMessage(null);

    try {
      const response = await axios.post<DoorControlResponse>(
        'https://smart-home-tech-api.vercel.app/api/smart-door/control',
        { action, status }, // Include status in the payload
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the JWT token is stored in localStorage
            'Content-Type': 'application/json',
          },
        }
      );

      setResponseMessage(response.data.message || 'Action successful');

      // Update status based on the action
      if (action === 'lock') setStatus('locked');
      else if (action === 'unlock') setStatus('unlocked');
      else if (action === 'busy') setStatus('busy');

    } catch (err) {
      handleAxiosError(err, 'Failed to control the door.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handling
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && (err as { isAxiosError?: boolean }).isAxiosError === true) {
      // Handle AxiosError type
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      // Handle generic errors
      setError(err.message || 'An unexpected error occurred.');
    } else {
      // Handle unknown errors
      setError('An unknown error occurred.');
    }
    setResponseMessage(null); // Clear success message on error
  };

  return (
    <div className="smart-door-container">
      <h2 className="title">Smart Door Control</h2>

      {error && <p className="error-message">{error}</p>}
      {responseMessage && <p className="success-message">{responseMessage}</p>}

      {/* Display current status */}
      <p className="status-display">Current Door Status: <strong>{status}</strong></p>

      <div className="grid-container">
        <button
          className="action-button"
          onClick={() => handleDoorAction('lock')}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Lock'}
        </button>
        <button
          className="action-button"
          onClick={() => handleDoorAction('unlock')}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Unlock'}
        </button>
        <button
          className="action-button"
          onClick={() => handleDoorAction('busy')}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Busy'}
        </button>
      </div>
    </div>
  );
};

export default SmartDoor;

