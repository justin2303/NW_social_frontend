// NavBar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavBar = ({ GUID }) => {
  const [regiment, setRegiment] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Implement search logic here, e.g., redirect or filter results
    console.log("Searching for:", searchTerm);
  };
  const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };


  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await fetch('http://localhost:8080/navigation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ GUID }), // Use the GUID here
        });

        if (response.ok) {
          const data = await response.json();
          setRegiment(data.Regiment ); // Adjust according to your API response structure
          if (data.Pfp && data.Pfp.length > 0) {
            setProfilePic(data.Pfp);
            sessionStorage.setItem('profilePic', data.Pfp); // Save to sessionStorage
          } else {
            setProfilePic('/default.png')
            sessionStorage.setItem('profilePic', '/default.png'); // Save default to sessionStorage
          }
        } else {
          setError('Failed to load navigation data.');
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
      }
    };

    if (GUID) {
      fetchNavigationData(); // Call the fetch function with GUID
    }
  }, [GUID]); // Dependency array ensures it runs when GUID changes

  return (
    <nav className="navbar">
      <ul>
        <li>
        <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
        </li>
        <li>
          <Link to={`/home`} state={{ GUID: GUID }} className="custom-link">Home</Link>
        </li>
        <li>
        <Link to={`/myregiment`} state={{ reg: regiment, GUID: GUID }} className="custom-link">Regiment View</Link>
        </li>
        <li>
        <Link to={`/lastEvent`} state={{ reg: regiment, GUID: GUID }} className="custom-link">Past Event</Link>
        </li>
        <li>
        <Link to={`/commendations`} state={{ reg: regiment, GUID: GUID }} className="custom-link">Commendations</Link>
        </li>
        <li>
            <div className='profile-container'>
            <img src={profilePic} alt="Profile" className="profile-pic" onClick={toggleDropdown} />
          {dropdownVisible && (
                    <div className="dropdown-menu">
                        <Link to={"/change-profile-pic"} state={{GUID: GUID}} className="dropdown-item">Change Profile Picture</Link>
                        <Link to={"/my-profile"} state={{GUID: GUID}} className="dropdown-item">My Profile</Link>
                        <Link to="/settings" className="dropdown-item">Settings</Link>
                        <Link to={"/login"} state={{GUID: GUID}} className="dropdown-item">Logout</Link>
                    </div>
                )}
            </div>
        </li>
      </ul>
      {error && <p>Error: {error}</p>}
    </nav>
  );
};

export default NavBar;
