import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from './Navbar';
import './Home.css';
import './myprofile.css';

const MyProfile = () => {
  const location = useLocation();
  const { GUID } = location.state || {};
  
  const [favoriteFaction, setFavoriteFaction] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [Uname, setUname] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [bio, setBio] = useState('Your bio goes here.');
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const SaveProfile = async () => {
    try {
        const response = await fetch('http://localhost:8080/save_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ GUID, Bio: bio, Faction: favoriteFaction }),
        });

        if (response.ok) {
            console.log("Profile preferences saved");
            // You can add any additional logic here if needed (e.g., show a success message)
        } else {
            setError("Error saving changes");
            console.error("Error response:", response.status, response.statusText); // Log the error details
        }
    } catch (error) {
        setError("Error saving changes: " + error.message); // Catch any network errors
        console.error("Fetch error:", error); // Log the error
    }
};
  useEffect(() => {
    // Retrieve profile picture from sessionStorage
    const cachedPfp = sessionStorage.getItem('profilePic') || '/hydraulic_default_pfp.png';
    setProfilePic(cachedPfp);
    const name = sessionStorage.getItem('Uname') || 'Elliot Roux';
    setUname(name);

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/fetch_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID }),
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
    if (GUID) {
      fetchData();
    } else {
      setError('No GUID provided.');
    }
  }, [GUID]);

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
          <Link to={"/change-profile-pic"} state={{ GUID: GUID }}>
              <img src={profilePic} alt="Profile" />
            </Link>
            <h3>{Uname}</h3>
          </div>
          <div className="favorite-faction">
            <h3>Favorite Faction</h3>
            <img src={favoriteFaction} className='faction_img' alt="Favorite Faction" />
            <div className="faction-options">
              {factions.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Faction ${index + 1}`}
                  className={favoriteFaction === src ? 'selected' : ''} // Check if the favoriteFaction matches the faction src
                  onClick={() => setFavoriteFaction(src)} // Set favoriteFaction to the faction image source
                />
              ))}
            </div>
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
        <div className="bio-section" onClick={toggleEdit}>
          <h3>Bio</h3>
          {isEditing ? (
            <input
              type="text"
              value={bio}
              onChange={handleBioChange}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bio-input"
            />
          ) : (
            <p>{bio}</p>
          )}
        </div>
      </div>
      <button
        style={{
          fontFamily: 'font61',
          marginLeft: '50px',
          background: '#565656',
          color: 'white',
          border: '2px solid black',
          cursor: 'pointer',
        }}
        onClick={SaveProfile}
      >Save Changes</button>
    </div>
  );
};

export default MyProfile;
