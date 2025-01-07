import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './admin.css';
const Verify_Pass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { GUID } = location.state || {}; // Extract GUID from location state

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Trim any trailing whitespaces from the code
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/verifyReset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ GUID, Code: trimmedCode }),
      });

      if (response.ok) {
        // Navigate to the change password page if verification is successful
        navigate('/changepass', { state: { GUID } });
      } else {
        // Show error message if the verification fails
        setErrorMessage('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className='admin_stuff'>
      <h2>A Verification Code has been sent to your associated Email, please enter it to reset your password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            type="text"
            id="verificationCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your verification code"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Verify Code</button>
      </form>
    </div>
  );
};

export default Verify_Pass;
