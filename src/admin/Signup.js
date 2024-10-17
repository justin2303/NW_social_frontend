import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const Signup = () => {
    const [GUID, setGUID] = useState('');
    const [error, setError] = useState('');
    const [Password, setPassword] = useState('');
    const [Password2, setPassword2] = useState('');
    const navigate = useNavigate();
    const handleSignup = async (event) => {
        event.preventDefault();
        if (Password2 !== Password) {
          setError("Confirmation password doesn't match with set password, please try again")
          return;
        }
        // Call your API with username and password
        const response = await fetch('http://localhost:8080/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID, Password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Handle successful login: Redirect to home or update UI
          console.log('Signup successful, redirecting to ask for recovery email...');
          navigate('/recovery_email', { state: { GUID } })
          
        } else {
          // Handle login error
          setError('Invalid GUID, user may already be signed up');
        }
      };

      return (
        <div className='admin_stuff'>
          <h2>Signup</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSignup}>
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
              <label htmlFor="password">Set Password: </label>
              <input
                type="password"
                id="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
            <label htmlFor="password2">Confirm Password: </label>
            <input
              type="password"
              id="password2"
              value={Password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            </div>
            <button type="submit">Signup</button>
          </form>
        </div>
      );
}
export default Signup;