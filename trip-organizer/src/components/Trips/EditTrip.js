import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

function EditTrip({ user }) {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip.");
      }
    };
    fetchTrip();
  }, [id]);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/trips/${id}`, {
        id: parseInt(id),
        title: trip.title,
        destination: trip.destination,
        date: trip.date,
        capacity: parseInt(trip.capacity),
        description: trip.description,
        ownerId: user.id
      });
      navigate("/trips");
    } catch (err) {
      console.error(err);
      setError("Failed to update trip.");
    }
  };

  if (!trip) return <p>Loading...</p>;

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card>
        <Card.Body>
          <h2 className="mb-4">Edit Trip</h2>
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
                value={trip.date.slice(0, 10)}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
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
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditTrip;
