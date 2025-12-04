import axios from 'axios';

const API_HOST_URL = 'http://localhost:8080';

export const userApi = axios.create({
  baseURL: `${API_HOST_URL}/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const groupApi = axios.create({
  baseURL: `${API_HOST_URL}/api/groups`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const subscriptionApi = axios.create({
  baseURL: `${API_HOST_URL}/api/subscriptions`,
  headers: {
    'Content-Type': 'application/json',
  }
})
