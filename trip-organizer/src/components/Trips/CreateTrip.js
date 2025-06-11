import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

function CreateTrip({ user }) {
  const [trip, setTrip] = useState({
    title: "",
    destination: "",
    date: "",
    capacity: 1,
    description: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/trips", { ...trip, ownerId: user.id });
      navigate("/trips");
    } catch (err) {
      console.error(err);
      setError("Failed to create trip.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card>
        <Card.Body>
          <h2 className="mb-4">Create a New Trip</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={trip.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                name="destination"
                value={trip.destination}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={trip.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="capacity"
                value={trip.capacity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={trip.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Create Trip
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateTrip;
