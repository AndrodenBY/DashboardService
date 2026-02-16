import axios, {type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig} from 'axios';

const DOCKER_URL = 'http://localhost:8080';
const LOCAL_URL = 'https://localhost:7089';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const userApi = axios.create({
  baseURL: `${DOCKER_URL}/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const groupApi = axios.create({
  baseURL: `${DOCKER_URL}/api/groups`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const subscriptionApi = axios.create({
  baseURL: `${DOCKER_URL}/api/subscriptions`,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const apiInterceptors = (getAccessToken: () => Promise<string>) => {

  const addToken = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token interceptor error", error);
    }
    return config;
  };

  const failoverInterceptor = async (error: AxiosError): Promise<AxiosResponse> => {
    const config = error.config as RetryConfig;

    if (!error.response && config && !config._retry) {
      config._retry = true;

      if (config.baseURL) {
        config.baseURL = config.baseURL.replace(DOCKER_URL, LOCAL_URL);
      }

      console.warn(
        `%c[Failover] Primary API unreachable. Retrying with: ${config.baseURL}`,
        'color: orange; font-weight: bold;'
      );
      return axios({
        ...config,
        headers: config.headers
      });
    }

    return Promise.reject(error);
  };

  const apis = [userApi, groupApi, subscriptionApi, axios];

  apis.forEach((api) => {
    api.interceptors.request.use(addToken);
    if (api !== axios) {
      api.interceptors.response.use((response) => response, failoverInterceptor);
    }
  });
};
