import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.defaults.headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDU4MzY1MTUsImV4cCI6MTYwNjcwMDUxNSwic3ViIjoiOTJhY2JkMTQtOWVkZC00YjE1LWEwYWYtYzhkODMzNzg4MjVjIn0.B7q4elkrqj8BvW2OMGILd548DTEzZnbGHRHnsfDeMmM`;

export default api;
