import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';

function TripDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  const fetchTrip = useCallback(async () => {
    try {
      const response = await API.get(`/trips/${id}`);
      const tripData = response.data;
      setTrip(tripData);
      setIsOwner(tripData.owners?.some(owner => owner.id === user?.id));
      setIsParticipant(tripData.participants?.some(participant => participant.id === user?.id));
    } catch (error) {
      console.error('Error fetching trip details:', error);
    }
  }, [id, user]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const handleJoin = async () => {
    try {
      await API.post(`/trips/${trip.id}/join`, { userId: parseInt(user.id) });
      await fetchTrip();
    } catch (error) {
      console.error('Failed to join trip:', error);
    }
  };

  const handleLeave = async () => {
    try {
      await API.post(`/trips/${trip.id}/leave`, { userId: parseInt(user.id) });
      await fetchTrip();
    } catch (error) {
      console.error('Failed to leave trip:', error);
    }
  };

  const handleAddOwner = async (userId) => {
    try {
      await API.post(`/trips/${trip.id}/owners/add`, { userId });
      await fetchTrip();
    } catch (error) {
      console.error('Failed to add owner:', error);
    }
  };

  const handleRemoveOwner = async (userId) => {
    try {
      await API.post(`/trips/${trip.id}/owners/remove`, { userId });
      await fetchTrip();
    } catch (error) {
      console.error('Failed to remove owner:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/trips/${trip.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/trips/${trip.id}`);
      navigate('/trips');
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div>
      <h2>{trip.title}</h2>
      <p><strong>Destination:</strong> {trip.destination}</p>
      <p><strong>Date:</strong> {trip.date}</p>
      <p><strong>Description:</strong> {trip.description}</p>
      <p><strong>Capacity:</strong> {trip.participants?.length}/{trip.capacity}</p>
      <p><strong>Owner(s):</strong> {trip.owners?.map(o => o.username).join(', ')}</p>
      <p><strong>Participants:</strong></p>
      <ul>
        {trip.participants?.length > 0
          ? trip.participants.map((p, index) => (
              <li key={index}>
                {p.username}
                {isOwner && user.id !== p.id && (
                  trip.owners?.some(o => o.id === p.id) ? (
                    <button onClick={() => handleRemoveOwner(p.id)}>Remove Ownership</button>
                  ) : (
                    <button onClick={() => handleAddOwner(p.id)}>Make Owner</button>
                  )
                )}
              </li>
            ))
          : <li>No participants</li>}
      </ul>

      <p><strong>Organized by:</strong> {trip.organizer || "Unknown"}</p>

      {user && !isParticipant && !isOwner && trip.participants.length < trip.capacity && (
        <button onClick={handleJoin}>Join Trip</button>
      )}
      {user && isParticipant && <button onClick={handleLeave}>Leave Trip</button>}
      {user && isOwner && (
        <>
          <button onClick={handleEdit}>Edit Trip</button>
          <button onClick={handleDelete}>Delete Trip</button>
        </>
      )}
    </div>
  );
}

export default TripDetails;
