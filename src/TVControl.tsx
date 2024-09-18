import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './TVControl.css'; // Add a CSS file for styling

// Define the expected response type
interface TVControlResponse {
  message: string;
}

const TVControl: React.FC = () => {
  const [action, setAction] = useState<string>('on');
  const [volume, setVolume] = useState<number>(10);
  const [channel, setChannel] = useState<number>(1);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTVAction = async () => {
    setLoading(true);
    setError(null);
    setResponseMessage('');

    try {
      const payload: any = { action };

      if (action === 'volume_up' || action === 'volume_down') {
        payload.volume = volume;
      } else if (action === 'change_channel') {
        payload.channel = channel;
      }

      console.log('Payload:', payload); // Debug to see the payload structure before sending the request
      const response = await axios.post<TVControlResponse>(
        'https://smart-home-tech-api.vercel.app/api/tv/control',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
            'Content-Type': 'application/json',
          },
        }
      );

      setResponseMessage(response.data.message || 'Action successful');
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to control the TV.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handling
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && typeof err === 'object' && 'response' in err) {
      // Use type assertion for AxiosError
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred.');
    } else {
      setError('An unknown error occurred.');
    }
    setResponseMessage(''); // Clear previous success message
  };

  return (
    <div className="tv-control-container">
      <h2>TV Control</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}

      <div className="action-grid">
        <button
          className={`action-btn ${action === 'on' ? 'active' : ''}`}
          onClick={() => setAction('on')}
          disabled={loading}
        >
          Turn On
        </button>
        <button
          className={`action-btn ${action === 'off' ? 'active' : ''}`}
          onClick={() => setAction('off')}
          disabled={loading}
        >
          Turn Off
        </button>
        <button
          className={`action-btn ${action === 'volume_up' ? 'active' : ''}`}
          onClick={() => setAction('volume_up')}
          disabled={loading}
        >
          Volume Up
        </button>
        <button
          className={`action-btn ${action === 'volume_down' ? 'active' : ''}`}
          onClick={() => setAction('volume_down')}
          disabled={loading}
        >
          Volume Down
        </button>
        <button
          className={`action-btn ${action === 'change_channel' ? 'active' : ''}`}
          onClick={() => setAction('change_channel')}
          disabled={loading}
        >
          Change Channel
        </button>
      </div>

      {(action === 'volume_up' || action === 'volume_down') && (
        <div className="control-input">
          <label htmlFor="volume">Volume: </label>
          <input
            id="volume"
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            disabled={loading}
          />
        </div>
      )}

      {action === 'change_channel' && (
        <div className="control-input">
          <label htmlFor="channel">Channel: </label>
          <input
            id="channel"
            type="number"
            value={channel}
            onChange={(e) => setChannel(Number(e.target.value))}
            disabled={loading}
          />
        </div>
      )}

      <button className="submit-btn" onClick={handleTVAction} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
};

export default TVControl;

