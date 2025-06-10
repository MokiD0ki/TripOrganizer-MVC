import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";

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
        <div>
            <h2>Edit Trip</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input name="title" value={trip.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Destination:</label>
                    <input name="destination" value={trip.destination} onChange={handleChange} required />
                </div>
                <div>
                    <label>Date:</label>
                    <input name="date" type="date" value={trip.date.slice(0, 10)} onChange={handleChange} required />
                </div>
                <div>
                    <label>Capacity:</label>
                    <input name="capacity" type="number" value={trip.capacity} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={trip.description} onChange={handleChange} />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditTrip;
