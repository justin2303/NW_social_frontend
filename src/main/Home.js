import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const { GUID } = location.state || {};
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/home_page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID }),
        });

        if (response.ok) {
          const data = await response.json(); // Assuming the response is in JSON format
          setResponseData(data); // Handle the response data
        } else {
          setError('Failed to load data from the server.');
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
      }
    };

    // Only call the API if the GUID exists
    if (GUID) {
      fetchData();
    } else {
      setError('No GUID provided.');
    }
  }, [GUID]); // Dependency array ensures the effect runs when GUID changes

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {GUID && <p>Your GUID: {GUID}</p>}

      {error && <p>Error: {error}</p>}
      {responseData && (
        <div>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HomePage;