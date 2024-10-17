import './Home.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './Navbar';

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
      <div className='navbar-wrapper'>
          <NavBar GUID={GUID} /> {/* Pass the GUID to NavBar */}
        </div>
  <h1>Your stats for the last Saturday Event </h1>
  {GUID && <p>Your GUID: {GUID}</p>}

  {error && <p>Error: {error}</p>}
  
  {responseData && (
    <div> 
    {responseData && (
      <div className="response-container">
        {/* Kills Column */}
        <div className="column">
          <h3>Kills</h3>
          <table className="data-table">
            <tbody>
            {responseData.Kills && Array.isArray(responseData.Kills) && responseData.Kills.length > 0 ? (
              responseData.Kills.map((killsArray, index) => (
                <tr key={index}>
                  {killsArray.map((Kills, innerIndex) => (
                    <td key={innerIndex}>{Kills}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td>No kills found</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
  
        {/* Deaths Column */}
        <div className="column">
          <h3>Deaths</h3>
          <table className="data-table">
            <tbody>
            {responseData.Deaths && Array.isArray(responseData.Deaths) && responseData.Deaths.length > 0 ? (
              responseData.Deaths.map((deathArray, index) => (
                <tr key={index}>
                  {deathArray.map((deaths, innerIndex) => (
                    <td key={innerIndex}>{deaths}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td>No deaths to report!</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
  
        {/* Login Column */}
        <div className="column">
          <h3>Login:</h3>
          <table className="data-table">
            <tbody>
            {responseData.Logins && Array.isArray(responseData.Logins) && responseData.Logins.length > 0 ? (
              responseData.Logins.map((loginArray, index) => (
                <tr key={index}>
                  {loginArray.map((login, innerIndex) => (
                    <td key={innerIndex}>{login}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td>You.. weren't in the last event?!</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
  
  )}
</div>
  );
};

export default HomePage;