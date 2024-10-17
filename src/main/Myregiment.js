import React from 'react';
import { useLocation } from 'react-router-dom';

const RegimentComponent = () => {
  const location = useLocation();
  const { reg, GUID } = location.state || {}; // Accessing reg and GUID from state

  return (
    <div>
      <h1>Regiment: {reg}</h1>
      <h2>GUID: {GUID}</h2>
      {/* Your component logic here */}
    </div>
  );
};

export default RegimentComponent;
