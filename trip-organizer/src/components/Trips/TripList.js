import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";

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
    <Container className="mt-4">
      <h2 className="mb-4">Available Trips</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {trips.map((trip) => (
          <Col key={trip.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>
                  <Link to={`/trips/${trip.id}`} className="text-decoration-none">
                    {trip.title}
                  </Link>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {trip.destination}
                </Card.Subtitle>
                <Card.Text>
                  <strong>{trip.participants?.length}/{trip.capacity}</strong> joined<br />
                  Organizer: {trip.organizer || 'Unknown'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TripList;
