import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Define the expected response type for login
interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Make a POST request to login endpoint
      const response = await axios.post<LoginResponse>(
        'https://smart-home-tech-api.vercel.app/api/users/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Store the token in local storage
      localStorage.setItem('token', response.data.token);
      setSuccessMessage('Login successful');
      
      // Redirect to the dashboard
      navigate('/dashboard'); // Use navigate to redirect
    } catch (err) {
      handleAxiosError(err, 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handling for Axios and other errors
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
    setSuccessMessage(null); // Clear success message on error
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

