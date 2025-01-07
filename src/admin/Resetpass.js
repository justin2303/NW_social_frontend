import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const ResetPass = () => {
    const [GUID, setGUID] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleReset = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/resetPass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID }),
        });
    
        await response;
    
        if (response.ok) {
          // Handle successful login: Redirect to home or update UI
          console.log('Reset req successful, redirecting to ask for code');
          navigate('/verify_reset', { state: { GUID } })
          
        } else {
          // Handle login error
          setError('Invalid GUID, user may not be signed up');
        }
      };

      return (
        <div className='admin_stuff'>
          <h2>Reset Password Page</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleReset}>
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
            
            <button type="submit">Reset Password</button>
          </form>
        </div>
      );
}
export default ResetPass;