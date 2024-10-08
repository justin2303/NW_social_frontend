import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './admin/Login'; // Import the Login component
import Home from './main/Home'; // Import the Home component

const App = () => {
  return (
    <Routes>
      {/* Default route: redirect to /login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;

