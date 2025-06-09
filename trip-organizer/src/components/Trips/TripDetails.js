import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (id) {
      API.get(`/trips/${id}`)
        .then(response => {
          console.log("Trip detail response:", response.data);
          setTrip(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch trip details:', error);
        });
    }
  }, [id]);

  if (!trip) {
    return <div>Loading trip details...</div>;
  }

  return (
    <div>
      <h2>{trip.title}</h2>
      <p><strong>Destination:</strong> {trip.destination}</p>
      <p><strong>Date:</strong> {trip.date}</p>
      <p><strong>Capacity:</strong> {trip.capacity}</p>
      <p><strong>Description:</strong> {trip.description}</p>
      
      <p><strong>Participants:</strong></p>
      <ul>
        {trip.participants?.length > 0
          ? trip.participants.map((username, index) => (
              <li key={index}>{username}</li>
            ))
          : <li>No participants</li>}
      </ul>

      <p><strong>Organized by:</strong> {trip.organizer || "Unknown"}</p>
    </div>
  );
}

export default TripDetails;
