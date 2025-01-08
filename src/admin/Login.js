import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
const Login = () => {
  const [GUID, setGUID] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Function to handle login 
  const handleSignup = () => {
    navigate('/signup'); // Navigate to signup page
  };
  const handlePassChange = () => {
    navigate('/resetpass'); //nav to respass
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Clear the error before making a new attempt
    // Call your API with username and password
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ GUID, Password }),
    });



    if (response.ok) {
      const data = await response.json(); // Parse JSON data from the response
      console.log('Login successful');
      console.log('Session:', data.Session);
      localStorage.setItem("SessionID", data.Session)
      navigate('/home', { state: { GUID } });
      // Handle successful login: Redirect to home or update UI
      console.log('Login successful, redirecting to Home...');
    } else {
      // Handle login error
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className='admin_stuff'>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="GUID">GUID: </label>
          <input
            type="text"
            id="GUID"
            value={GUID}
            onChange={(e) => setGUID(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {/* Signup Button */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleSignup}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '0',
          }}
        >
          signup
        </button>
         here if this is your first time
      </div>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handlePassChange}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '0',
          }}
        >
          reset
        </button>
         password if you forgot it
      </div>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleSignup}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '0',
          }}
        >
          sign-in
        </button>
         here for admins
      </div>
    </div>
  );
};

export default Login;