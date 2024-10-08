import React, { useState } from 'react';

const Signup = () => {
    const [GUID, setGUID] = useState('');
    const [error, setError] = useState('');
    const handleSignup = async (event) => {
        event.preventDefault();
    
        // Call your API with username and password
        const response = await fetch('https://api.yourapp.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
    
        const data = await response.json();
    
        if (data.success) {
          // Handle successful login: Redirect to home or update UI
          console.log('Login successful, redirecting to Home...');
        } else {
          // Handle login error
          setError('Invalid credentials, please try again.');
        }
      };
}