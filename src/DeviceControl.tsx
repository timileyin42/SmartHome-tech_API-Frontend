import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import './DeviceControl.css';

interface Device {
  _id: string;
  name: string;
  status?: string;
  type: string;
}

const DeviceControl: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [newDeviceType, setNewDeviceType] = useState<string>('');

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Device[]>('http://localhost:3000/api/devices', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDevices(response.data);
      setResponseMessage('Devices fetched successfully');
    } catch (err) {
      handleAxiosError(err, 'Error fetching devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleDeviceAction = async (deviceId: string, action: string, status: string, type: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://localhost:3000/api/devices/${deviceId}/control`;
      const payload = { type, action, status };

      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setResponseMessage('Action successful');
      fetchDevices(); // Refresh devices after successful action
    } catch (err) {
      handleAxiosError(err, `Error performing action: ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        'http://localhost:3000/api/devices',
        { name: newDeviceName, type: newDeviceType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setResponseMessage('Device created successfully');
      setNewDeviceName('');
      setNewDeviceType('');
      fetchDevices();
    } catch (err) {
      handleAxiosError(err, 'Error creating device');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`https://smart-home-tech-api.vercel.app/api/devices/${deviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResponseMessage('Device deleted successfully');
      fetchDevices();
    } catch (err) {
      handleAxiosError(err, 'Error deleting device');
    } finally {
      setLoading(false);
    }
  };

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && (err as { isAxiosError?: boolean }).isAxiosError) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred.');
    } else {
      setError('An unknown error occurred.');
    }
    setResponseMessage(null);
  };

  return (
    <div className="device-control-container">
      <h2>Device Control</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}

      <div className="device-form">
        <input
          type="text"
          placeholder="New Device Name"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Device Type (e.g., light, ac, moon_light, refrigerator)"
          value={newDeviceType}
          onChange={(e) => setNewDeviceType(e.target.value)}
        />
        <button onClick={handleCreateDevice}>Create Device</button>
      </div>

      <div className="device-grid">
        {devices.map((device) => (
          <div key={device._id} className="device-card">
            <h3>{device.name}</h3>
            <p>Status: {device.status || 'Unknown'}</p>

            {device.type === 'light' && (
              <div>
                <button className="on-btn" onClick={() => handleDeviceAction(device._id, 'Turn On', 'on', device.type)}>
                  Turn On
                </button>
                <button className="off-btn" onClick={() => handleDeviceAction(device._id, 'Turn Off', 'off', device.type)}>
                  Turn Off
                </button>
                <button className="dim-btn" onClick={() => handleDeviceAction(device._id, 'Dim', 'Dim', device.type)}>
                  Dim
                </button>
              </div>
            )}

            {device.type === 'ac' && (
              <div>
                <button className="on-btn" onClick={() => handleDeviceAction(device._id, 'Turn On', 'on', device.type)}>
                  Turn On
                </button>
                <button className="off-btn" onClick={() => handleDeviceAction(device._id, 'Turn Off', 'off', device.type)}>
                  Turn Off
                </button>
                <button
                  className="increase-temp-btn"
                  onClick={() => handleDeviceAction(device._id, 'IncreaseTemp', 'Increasing Temperature', device.type)}
                >
                  Increase Temp
                </button>
                <button
                  className="decrease-temp-btn"
                  onClick={() => handleDeviceAction(device._id, 'DecreaseTemp', 'Decreasing Temperature', device.type)}
                >
                  Decrease Temp
                </button>
              </div>
            )}

            {device.type === 'moon_light' && (
              <div>
                <button className="on-btn" onClick={() => handleDeviceAction(device._id, 'Turn On', 'on', device.type)}>
                  Turn On
                </button>
                <button className="off-btn" onClick={() => handleDeviceAction(device._id, 'Turn Off', 'off', device.type)}>
                  Turn Off
                </button>
              </div>
            )}

            {device.type === 'refrigerator' && (
              <div>
                <button className="on-btn" onClick={() => handleDeviceAction(device._id, 'Turn On', 'on', device.type)}>
                  Turn On
                </button>
                <button className="off-btn" onClick={() => handleDeviceAction(device._id, 'Turn Off', 'off', device.type)}>
                  Turn Off
                </button>
              </div>
            )}

            <button className="delete-btn" onClick={() => handleDeleteDevice(device._id)}>
              Delete Device
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceControl;

