import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './admin.css';


const ChangePass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { GUID } = location.state || {}; // Extract GUID from location state

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/changePass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ GUID, Password: password }),
      });

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
      } else {
        setErrorMessage('Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="admin_stuff">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="change-pass-button">
          Change Password
        </button>
      </form>
    </div>
  );
};
export default ChangePass;

