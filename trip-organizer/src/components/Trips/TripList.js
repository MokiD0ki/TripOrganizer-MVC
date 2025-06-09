import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Link } from 'react-router-dom';

function TripList() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    API.get('/trips')
      .then(response => {
        console.log("✅ API response:", response);

        if (Array.isArray(response.data)) {
          setTrips(response.data);
        } else {
          console.error('❌ Unexpected response shape:', response.data);
        }
      })
      .catch(error => {
        console.error('❌ Failed to fetch trips:', error);
      });
  }, []);

  return (
    <div>
      <h2>Available Trips</h2>
      <ul>
        {trips.map(trip => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`}>{trip.title} - {trip.destination}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripList;
