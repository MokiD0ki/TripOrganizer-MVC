import React from "react";
import { Link } from "react-router-dom";

function Home({ user }) {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome to Trip Organizer</h1>

      {user && <p className="lead">Hello, <strong>{user.username}</strong>!</p>}
      <p>This is the homepage.</p>

      <p>
        <Link to="/trips" className="btn btn-primary me-2">Browse Trips</Link>
        {!user && <Link to="/login" className="btn btn-outline-secondary">Login</Link>}
      </p>
    </div>
  );
}

export default Home;
