// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Welcome to Trip Organizer</h2>
      <p>This is the homepage.</p>
      <Link to="/trips">Browse Trips</Link> | <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;
