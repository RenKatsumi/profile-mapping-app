// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import Home from './pages/Home';
import ProfileList from './pages/ProfileList';
import ProfileDetails from './pages/ProfileDetails';
import AdminPanel from './pages/AdminPanel';
import 'leaflet/dist/leaflet.css';


const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<ProfileList />} />
          <Route path="/profile/:id" element={<ProfileDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
