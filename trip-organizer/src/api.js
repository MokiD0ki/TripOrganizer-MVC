import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7032/api',
  withCredentials: true,
});

// Axios-based login function
export async function loginUser(credentials) {
  const response = await API.post('/auth/login', credentials);
  return response.data; // must be { id, username }
}

export function logoutUser() {
  localStorage.removeItem("user");
}

export default API;