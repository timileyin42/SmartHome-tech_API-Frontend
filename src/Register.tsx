import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define the expected response type for registration
interface RegisterResponse {
  message: string;
}

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle form submission for registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Make a POST request to registration endpoint
      const response = await axios.post<RegisterResponse>(
        'https://smart-home-tech-api.vercel.app/api/users/register',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Display success message from response
      setSuccessMessage(response.data.message || 'Registration successful');
      setUsername(''); // Clear the username field
      setPassword(''); // Clear the password field

      // Redirect to login page after a 5-second delay
      setTimeout(() => {
        navigate('/login'); // Use navigate to redirect
      }, 5000); // 5-second delay

    } catch (err) {
      handleAxiosError(err, 'Registration failed. Please try again.');
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
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleRegister}>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;

