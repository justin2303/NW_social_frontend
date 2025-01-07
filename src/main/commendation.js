import './Home.css';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from './Navbar';
import './commendation.css';

const Commendations = () => {
  const location = useLocation();
  const { reg, GUID } = location.state || {}; // Accessing reg and GUID from state
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const player_feats = ["Top Kills", "Best KD", "Top Mitigated", "At least 10 kills", "At least 10 kills"]; // Example feats for each player

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/getcommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Regiment: reg, GUID }),
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

  // Run fetchData when the component mounts or GUID changes
  useEffect(() => {
    if (GUID) {
      fetchData();
    } else {
      setError('No GUID provided.');
    }
  }, [GUID, reg]);

  const CommendPlayer = async (Regiment, GUID, Commendee, NumCommends) => {
    if (NumCommends <= 0) {//do nothing with no one left to commend.
      return;
    }
    console.log(`Commending player with GUID: ${Commendee}`);
    try {
      const response = await fetch('http://localhost:8080/commendplayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Regiment: Regiment, GUID: GUID, ToCommend: Commendee }),
      });

      if (response.ok) {
        console.log('Player commended successfully');
        await fetchData(); // Refresh the data after successful commendation
      } else {
        console.error('Failed to commend player.');
      }
    } catch (error) {
      console.error('Error commending player:', error);
    }
  };

  return (
    <div>
      <div className='navbar-wrapper'>
        <NavBar GUID={GUID} /> {/* Pass the GUID to NavBar */}
      </div>
      {responseData ? (
        <div> 
          <h2>Number of commendations left: {responseData.Commends_left}</h2>
          <div className="player-cards-container">
            {responseData.Uname.map((uname, index) => (
              <div key={index} className="player-card">
                <Link to={"/profile"} state={{ GUID: GUID, GUID1: responseData.GUID[index], Uname: uname }}>
                  <img
                    src={
                      responseData.URL[index] === ''
                        ? '/default.png'  // Path to the default image
                        : responseData.URL[index]  // Path to the user image
                    }
                    alt="Profile"
                    className="player-image"
                  />
                </Link>
                <h3>{uname}</h3>
                <h4>{player_feats[index]}</h4> 
                <button 
                  className="commend-button"
                  disabled={
                    responseData.Uncommendables.length !== 3 || 
                    responseData.Uncommendables.includes(responseData.GUID[index])
                  } //the length is cuz in backend when detected some kinda error (u prob not in event) then it returns length = 0,
                  //else always lenght = 3 altho prob it just blank ""
                  onClick={() => CommendPlayer(reg, GUID, responseData.GUID[index], responseData.Commends_left)} // Call CommendPlayer with the player's GUID
                >
                  Commend
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>No commendations left, wait for next event</p>
        </div>
      )}
    </div>
  );
};

export default Commendations;