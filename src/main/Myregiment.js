import './Home.css';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from './Navbar';

const RegimentComponent = () => {
  const location = useLocation();
  const { reg, GUID } = location.state || {}; // Accessing reg and GUID from state
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/myregiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Regiment: reg,  GUID  }),
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
  }, [GUID, reg]); // Dependency array ensures the effect runs when GUID changes
  return (
    <div>
        <div className='navbar-wrapper'>
          <NavBar GUID={GUID} /> {/* Pass the GUID to NavBar */}
        </div>
        {responseData ? (
  <div>
    <h2>Player Stats</h2>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Total Kills</th>
          <th>Total Deaths</th>
          <th>Total Teamkills</th>
          <th>Events Participated</th>
          <th>Last Event</th>
        </tr>
      </thead>
      <tbody>
        {responseData.Uname.map((uname, index) => (
          <tr key={index}>
            <td>
            <Link to={"/profile"} state={{ GUID: GUID, GUID1: responseData.GUID[index], Uname: uname }}>
              <img
                src={
                  responseData.URL[index] === ''
                    ? '/default.png'  // Path to the default image
                    : responseData.URL[index]  // Path to the user image
                }
                alt="Profile"
                style={{
                  width: '50px',
                  height: '50px',
                  marginRight: '20px',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
          </Link>
        {uname}
      </td>
            <td>{responseData.Total_kills[index]}</td>
            <td>{responseData.Total_deaths[index]}</td>
            <td>{responseData.Total_teamkills[index]}</td>
            <td>{responseData.Events_Participated[index]}</td>
            <td>{responseData.Last_Event[index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div>
    <p>Loading player stats...</p>
  </div>
)}
    </div>
  );
};

export default RegimentComponent;
