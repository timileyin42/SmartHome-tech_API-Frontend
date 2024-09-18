import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './WeatherControl.css'; // Add a separate CSS file for styling

// Define the response structure
interface WeatherControlResponse {
  message: string;
}

const WeatherControl: React.FC = () => {
  const [location, setLocation] = useState<string>(''); // To capture location
  const [weatherMessage, setWeatherMessage] = useState<string | null>(null); // To display API response
  const [error, setError] = useState<string | null>(null); // To handle errors
  const [loading, setLoading] = useState<boolean>(false); // To manage loading state

  // Function to handle weather adjustment
  const handleWeatherAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    setWeatherMessage(null); // Clear previous messages

    try {
      const response = await axios.post<WeatherControlResponse>(
        'https://smart-home-tech-api.vercel.app/api/weather/adjust-weather',
        { location },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token-based authentication
          },
        }
      );

      // Accessing response.data with correct type
      setWeatherMessage(response.data.message || 'Weather adjustment successful.');
    } catch (err) {
      // Use the alternative error handling approach
      handleAxiosError(err, 'Failed to adjust devices based on weather.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handling using manual type checks
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    const axiosError = err as AxiosError<{ message?: string }>; // Cast error to AxiosError type
    if (axiosError.response && axiosError.response.data) {
      setError(axiosError.response.data.message || defaultMessage);
    } else if (axiosError.request) {
      setError('No response received from the server. Please check your connection.');
    } else {
      setError('An error occurred while setting up the request.');
    }
    setWeatherMessage(null); // Clear success message on error
  };

  return (
    <div className="weather-control-container">
      <h2>Weather Control</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherMessage && <p style={{ color: 'green' }}>{weatherMessage}</p>}

      <form onSubmit={handleWeatherAdjustment}>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adjusting...' : 'Adjust Devices Based on Weather'}
        </button>
      </form>
    </div>
  );
};

export default WeatherControl;

