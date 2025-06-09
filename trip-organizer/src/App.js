import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TripList from './components/Trips/TripList';
import TripDetails from './components/Trips/TripDetails';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <nav>
        <Link to="/trips">Trips</Link>
        {user ? (
          <span>Logged in as {user.username}</span>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;