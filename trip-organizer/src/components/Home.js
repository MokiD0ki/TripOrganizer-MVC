import React from "react";
import { Link } from "react-router-dom";

function Home({ user }) {
  return (
    <div>
      <h1>Welcome to Trip Organizer</h1>

      {user && <p>Hello, <strong>{user.username}</strong>!</p>}
      <p>This is the homepage.</p>

      <p>
        <Link to="/trips">Browse Trips</Link>
        {!user && <> | <Link to="/login">Login</Link></>}
      </p>
    </div>
  );
}

export default Home;