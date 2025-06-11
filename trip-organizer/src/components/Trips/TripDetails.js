import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';
import {
  Container,
  Card,
  ListGroup,
  Button,
  Alert,
  Badge,
} from 'react-bootstrap';

function TripDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [error, setError] = useState('');

  const fetchTrip = useCallback(async () => {
    try {
      const response = await API.get(`/trips/${id}`);
      const tripData = response.data;
      setTrip(tripData);
      setIsOwner(tripData.owners?.some(owner => owner.id === user?.id));
      setIsParticipant(tripData.participants?.some(p => p.id === user?.id));
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError('Failed to load trip.');
    }
  }, [id, user]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const handleJoin = async () => {
    try {
      await API.post(`/trips/${trip.id}/join`, { userId: parseInt(user.id) });
      await fetchTrip();
    } catch (err) {
      console.error('Failed to join trip:', err);
    }
  };

  const handleLeave = async () => {
    try {
      await API.post(`/trips/${trip.id}/leave`, { userId: parseInt(user.id) });
      await fetchTrip();
    } catch (err) {
      console.error('Failed to leave trip:', err);
    }
  };

  const handleAddOwner = async (userId) => {
    try {
      await API.post(`/trips/${trip.id}/owners/add`, { userId });
      await fetchTrip();
    } catch (err) {
      console.error('Failed to add owner:', err);
    }
  };

  const handleRemoveOwner = async (userId) => {
    try {
      await API.post(`/trips/${trip.id}/owners/remove`, { userId });
      await fetchTrip();
    } catch (err) {
      console.error('Failed to remove owner:', err);
    }
  };

  const handleEdit = () => {
    navigate(`/trips/${trip.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/trips/${trip.id}`);
      navigate('/trips');
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  if (!trip) return <p>Loading...</p>;

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>{trip.title}</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}

          <p><strong>Destination:</strong> {trip.destination}</p>
          <p><strong>Date:</strong> {trip.date}</p>
          <p><strong>Description:</strong> {trip.description}</p>
          <p>
            <strong>Capacity:</strong>{' '}
            <Badge bg="info">
              {trip.participants?.length}/{trip.capacity}
            </Badge>
          </p>
          <p>
            <strong>Organized by:</strong>{' '}
            {trip.organizer || "Unknown"}
          </p>

          <hr />
          <h5>Participants</h5>
          <ListGroup>
            {trip.participants?.length > 0 ? (
              trip.participants.map((p) => (
                <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
                  {p.username}
                  {isOwner && user.id !== p.id && (
                    trip.owners?.some(o => o.id === p.id) ? (
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveOwner(p.id)}>
                        Remove Owner
                      </Button>
                    ) : (
                      <Button variant="outline-success" size="sm" onClick={() => handleAddOwner(p.id)}>
                        Make Owner
                      </Button>
                    )
                  )}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No participants yet</ListGroup.Item>
            )}
          </ListGroup>

          <div className="mt-4">
            {user && !isParticipant && !isOwner && trip.participants.length < trip.capacity && (
              <Button variant="primary" onClick={handleJoin} className="me-2">
                Join Trip
              </Button>
            )}
            {user && isParticipant && (
              <Button variant="warning" onClick={handleLeave} className="me-2">
                Leave Trip
              </Button>
            )}
            {user && isOwner && (
              <>
                <Button variant="secondary" onClick={handleEdit} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TripDetails;
