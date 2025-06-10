import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function CreateTrip({ user }) {
  const [trip, setTrip] = useState({
    title: "",
    destination: "",
    date: "",
    capacity: 1,
    description: ""
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
    <div>
      <h2>Create a New Trip</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={trip.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Destination:</label>
          <input
            name="destination"
            value={trip.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            name="date"
            type="date"
            value={trip.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Capacity:</label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={trip.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={trip.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
}

export default CreateTrip;
