import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home";
import TripList from "./components/Trips/TripList";
import TripDetails from "./components/Trips/TripDetails";
import CreateTrip from "./components/Trips/CreateTrip";
import EditTrip from "./components/Trips/EditTrip";
import { logoutUser } from "./api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>{" "}
        {user ? (
          <>
            <Link to="/trips">Trips</Link>{" "}
            <Link to="/trips/create">Create Trip</Link>{" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/trips"
          element={
            <ProtectedRoute user={user}>
              <TripList user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:id"
          element={
            <ProtectedRoute user={user}>
              <TripDetails user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/create"
          element={
            <ProtectedRoute user={user}>
              <CreateTrip user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <EditTrip user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
