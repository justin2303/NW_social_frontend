import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [GUID, setGUID] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Function to handle login 
  const handleLogin = async (event) => {
    event.preventDefault();

    // Call your API with username and password
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ GUID, Password }),
    });



    if (response.ok) {
      navigate('/home', { state: { GUID } });
      // Handle successful login: Redirect to home or update UI
      console.log('Login successful, redirecting to Home...');
    } else {
      // Handle login error
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default Login;