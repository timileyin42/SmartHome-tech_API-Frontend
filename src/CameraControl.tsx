import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './CameraControl.css'; // Import the CSS file for styling

const CameraControl: React.FC = () => {
  const [action, setAction] = useState<string>('on');
  const [duration, setDuration] = useState<number | ''>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCameraAction = async () => {
    setLoading(true);
    try {
      const response = await axios.post<{ message: string }>(
        'https://smart-home-tech-api.vercel.app/api/camera/control', // Updated endpoint
        {
          action,
          duration: action === 'record' ? duration : undefined, // Only send duration for 'record' action
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        }
      );

      setResponseMessage(response.data.message);
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to control camera.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (isAxiosError(err)) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred.');
    } else {
      setError('An unknown error occurred.');
    }
    setResponseMessage(''); // Clear any previous success message
  };

  function isAxiosError(err: any): err is AxiosError {
    return err.isAxiosError === true;
  }

  return (
    <div className="camera-control-container">
      <h2>Camera Control</h2>

      {error && <p className="error-message">{error}</p>}
      {responseMessage && <p className="success-message">{responseMessage}</p>}
      {loading && <p>Processing...</p>}

      <div className="camera-control-grid">
        <button className={`action-button ${action === 'on' ? 'active' : ''}`} onClick={() => setAction('on')}>
          Turn On
        </button>
        <button className={`action-button ${action === 'off' ? 'active' : ''}`} onClick={() => setAction('off')}>
          Turn Off
        </button>
        <button className={`action-button ${action === 'record' ? 'active' : ''}`} onClick={() => setAction('record')}>
          Record
        </button>
        <button className={`action-button ${action === 'snapshot' ? 'active' : ''}`} onClick={() => setAction('snapshot')}>
          Take Snapshot
        </button>
      </div>

      {action === 'record' && (
        <div className="duration-input">
          <label htmlFor="duration">Duration (in seconds): </label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
      )}

      <button className="submit-button" onClick={handleCameraAction} disabled={loading}>Submit</button>
    </div>
  );
};

export default CameraControl;

