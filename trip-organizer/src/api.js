import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7032/api',
  withCredentials: false,
});

// Add JWT token to every request if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function expecting { token, user } in response
export async function loginUser(credentials) {
  const response = await API.post('/auth/login', credentials);
  const { token, user } = response.data;

  // Save token and user info
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}

// Logout function
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default API;
