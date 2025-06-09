import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/auth/register', form)
      .then(() => navigate('/login'))
      .catch(() => setError('Registration failed. Username may already exist.'));
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
