import axios from 'axios';

export const userApi = axios.create({
  baseURL: '/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const groupApi = axios.create({
  baseURL: '/api/groups',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const subscriptionApi = axios.create({
  baseURL: '/api/subscriptions',
  headers: {
    'Content-Type': 'application/json',
  }
})
