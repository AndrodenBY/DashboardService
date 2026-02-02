import axios from 'axios';

const API_HOST_URL = 'http://localhost:8080';

export const userApi = axios.create({
  baseURL: `${API_HOST_URL}/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const injectAuthHeader = (getAccessTokenSilently: () => Promise<string>) => {
  userApi.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Auth0 token error", error);
    }
    return config;
  });
};

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

