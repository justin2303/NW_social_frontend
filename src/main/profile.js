import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from './Navbar';
import './Home.css';
import './myprofile.css';

const Profile = () => {
  const location = useLocation();
  const { GUID } = location.state || {};
  const { GUID1} = location.state || {};
  const [favoriteFaction, setFavoriteFaction] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const { Uname } = location.state || {};
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState('Your bio goes here.');

  
  useEffect(() => {
    // Retrieve profile picture from sessionStorage

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/fetch_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID:GUID1 }),
        });

        if (response.ok) {
          const data = await response.json(); // Assuming the response is in JSON format
          setResponseData(data); // Handle the response data
          setBio(data.Bio || 'Your bio goes here.'); // Set the bio from response
          setProfilePic(data.Pfp || '/hydraulic_default_pfp.png'); // Set profile picture from response
          setFavoriteFaction(data.Faction ? `/${data.Faction}.png` : null); // Set faction image from response
        } else {
          setError('Failed to load data from the server.');
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
      }
    };

    // Only call the API if the GUID exists
    if (GUID1) {
      fetchData();
    } else {
      setError('No GUID provided.');
    }
  }, [GUID1]);

  const factions = [
    'faction1.png',
    'faction2.png',
    'faction3.png',
    'faction4.png',
    'faction5.png',
    'faction6.png'
  ];

  return (
    <div>
      <div className='navbar-wrapper'>
        <NavBar GUID={GUID} /> {/* Pass the GUID to NavBar */}
      </div>
      <div className="profile-card">
        <div className="top-row">
          <div className="profile-picture">
              <img src={profilePic} alt="Profile" />
            <h3>{Uname}</h3>
          </div>
          <div className="favorite-faction">
            <h3>Favorite Faction</h3>
            <img src={favoriteFaction} className='faction_img' alt="Favorite Faction" />
          </div>
        </div>
        <div className="medals-section">
          <h3>Medals</h3>
          <div className="medals-container">
            {responseData?.Medal_images?.map((image, index) => (
              <div key={index} className="medal-item">
                <img
                  src={image} // Medal image URL
                  alt={responseData.Medal_names[index]} // Medal name for accessibility
                  className="medal-image"
                />
                <div className="medal-tooltip">
                  <strong>{responseData.Medal_names[index]}</strong>
                  <p>{responseData.Medal_desc[index]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bio-section">
          <h3>Bio</h3>
            <p>{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
