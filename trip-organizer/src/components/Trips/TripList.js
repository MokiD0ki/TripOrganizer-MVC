import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

function TripList({ user }) {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await API.get("/trips");
        setTrips(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load trips.");
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h2>Available Trips</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`}>
              {trip.title} - {trip.destination} | 
              {trip.currentCount}/{trip.capacity} joined | 
              Owner: {trip.owner}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripList;
