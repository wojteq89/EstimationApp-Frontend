import axios from 'axios';

const axiosPasswordResetInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosPasswordResetInstance;
