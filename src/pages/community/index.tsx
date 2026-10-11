import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SimpleCommunity from './new/SimpleCommunity';

const CommunityRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SimpleCommunity />} />
    </Routes>
  );
};

export default CommunityRoutes; 