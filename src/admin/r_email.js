import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const Recovery_Mail = () => {
  const navigate = useNavigate();
    const location = useLocation();
    const { GUID } = location.state || {};
    const {Password} = location.state || {};
    const [FullMail, setMail] = useState('');
    const [confirMail, setConf] = useState('')
    const [error, setError] = useState('');
    const handleMail = async (event) => {
      const [Email, Domain] = FullMail.split("@");
        event.preventDefault();
        if (FullMail !== confirMail) {
          setError("Emails don't match, please try again")
          return;
        }
        const response = await fetch('http://localhost:8080/recovery_email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID, Email, Domain }),
        });

    
        if (response.ok) {
          console.log('Recovery email sent.');
          navigate('/verify_email', { state: { GUID,FullMail,Password } });
          console.log('Navigating to verifiactio code page');

        } else {
          setError('Invalid Email');
        }
      };

      return (
        <div className='admin_stuff'>
          <h2>Setup Recovery Email (for password reset)</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleMail}>
            <div>
              <label htmlFor="Email">Email: </label>
              <input
                type="text"
                id="Email"
                value={FullMail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
              <div>
              <label htmlFor="Conf_Email">Confirm Email: </label>
              <input
                type="text"
                id="Email2"
                value={confirMail}
                onChange={(e) => setConf(e.target.value)}
                required
              />
            </div>
            </div>
            <button type="submit">Enter</button>
          </form>
        </div>
      );
}
export default Recovery_Mail;