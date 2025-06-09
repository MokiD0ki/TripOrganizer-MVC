import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post('/auth/login', form)
      .then(res => {
        onLogin(res.data); // Save user data to state
        navigate('/trips');
      })
      .catch(() => setError('Login failed. Check your credentials.'));
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;