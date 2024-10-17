import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './admin/Login'; // Import the Login component
import Signup from './admin/Signup'; 
import Home from './main/Home'; // Import the Home component
import Recovery_Mail from './admin/r_email';
import Verify_Email from './admin/verify_email';
import RegimentComponent from './main/Myregiment'

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
    </Routes>
  );
};

export default App;

