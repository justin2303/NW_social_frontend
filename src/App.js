import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './admin/Login'; // Import the Login component
import Signup from './admin/Signup'; 
import Home from './main/Home'; // Import the Home component
import Recovery_Mail from './admin/r_email';
import Verify_Email from './admin/verify_email';
import RegimentComponent from './main/Myregiment'
import CropPFP from './admin/pfp';
import MyProfile from './main/myprofile';
import Profile from './main/profile';
const App = () => {
  return (
    <Routes>
      {/* Default route: redirect to /login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/recovery_email" element={<Recovery_Mail />} />
      <Route path="/verify_email" element={<Verify_Email />} />
      <Route path="/myregiment" element={<RegimentComponent/>} />
      <Route path="/change-profile-pic" element = {<CropPFP />} />
      <Route path="/my-profile" element = {<MyProfile />} />
      <Route path="/profile" element = {<Profile />} />
    </Routes>
  );
};

export default App;

