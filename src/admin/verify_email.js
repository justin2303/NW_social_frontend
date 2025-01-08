import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './admin.css';

const Verify_Email = () => {
const location = useLocation();
  const navigate = useNavigate();
  const { GUID } = location.state || {};
  const { FullMail } = location.state || {};
  const {Password} = location.state || {};
  const [Verification, setVerification] = useState('');
  const [error, setError] = useState('');
  const isVerified = useRef(false);

  // Function to reset the signup process
  const resetSignup = async () => {
    try {
      await fetch('http://localhost:8080/reset_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ GUID, Password }),
      });
    } catch (error) {
      console.error('Failed to reset signup:', error);
    }
    navigate('/signup'); // Always navigate to /signup after reset
  };

  // Timer logic: Set a timeout for 10 minutes (600000 milliseconds)
  useEffect(() => {
  const timer = setTimeout(() => {
    if (!isVerified.current) {
      console.log('10 minutes passed, resetting signup...');
      resetSignup();
      navigate('/signup');
    }
  }, 600000); // 10 minutes in milliseconds

  // Cleanup function to detect if the user navigates away
  return () => {
    clearTimeout(timer); // Clear the timer on component unmount
    if (!isVerified.current) { // Only reset if the user hasn't been verified
      resetSignup(); // Reset signup if the user navigates away before verifying
      navigate('/signup');
    }
  };
}, [GUID, navigate]);//this last part means the timer is reset each time the GUID or the navigate func is changed 
  //which covers both recallinig of this func (since it redefines navigate) and different signups (as they trigger diff GUIDs).


  // Handling form submission
  const handleVerification = async (event) => {
    const [Email, Domain] = FullMail.split('@');
    event.preventDefault();

    // Call your API with GUID, Email, Domain, and Verification code
    const response = await fetch('http://localhost:8080/verify_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ GUID, Email, Domain, Verification, Password }),
    });


    if (response.ok) {
      const data = await response.json(); // Parse JSON data from the response
      console.log('Email verified successfully');
      console.log('Session:', data.Session);
      localStorage.setItem("SessionID", data.Session)
      isVerified.current = true; //diffs between a an actual verified code and an unverified unmount
      navigate('/home', { state: { GUID } });
    } else {
      setError('Invalid Verification code, try again');
    }
  };

  return (
    <div className='admin_stuff'>
      <h2>A verification code has been sent to {FullMail}, please enter it within 10 minutes to verify your email</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleVerification}>
        <div>
          <label htmlFor="Verification_code">Verification Code: </label>
          <input
            type="text"
            id="Verification_code"
            value={Verification}
            onChange={(e) => setVerification(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default Verify_Email;
