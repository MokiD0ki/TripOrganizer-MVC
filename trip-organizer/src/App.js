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
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <div>
        {/* Bootstrap Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">TripOrganizer</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                {user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/trips">Trips</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/trips/create">Create Trip</Link>
                    </li>
                  </>
                )}
              </ul>
              <ul className="navbar-nav ms-auto">
                {user ? (
                  <li className="nav-item">
                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Page Routes */}
        <div className="container">
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
        </div>
      </div>
    </Router>
  );
}

export default App;
