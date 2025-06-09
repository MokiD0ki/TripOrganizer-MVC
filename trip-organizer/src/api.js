import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://localhost:7032/api',  // ✅ match your controller route
//   headers: {
//     'Accept': 'application/json'          // ✅ tell server we expect JSON
//   }
// });

const API = axios.create({
  baseURL: 'https://localhost:7032/api',
  withCredentials: true,
});

export default API;
