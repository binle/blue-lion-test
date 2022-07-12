import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JWT_TOKEN } from '../constants';
import { asyncGetCurrentAccountInformation } from '../services/account.services';
import { MyEventEmitter } from '../utils';

export const ENV = {
  BACKEND_PREFIX_URL: process.env.REACT_APP_BACKEND_PREFIX_URL,
};

export const appEventEmitter = new MyEventEmitter();

export const initialization = async () => {
  axios.interceptors.request.use((config) => {
    const jwt = window.localStorage.getItem(JWT_TOKEN);
    if (config.headers && jwt) {
      config.headers.authorization = `Bearer ${jwt}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        window.localStorage.removeItem(JWT_TOKEN);
        useNavigate()('/login');
      } else {
        return Promise.reject(error);
      }
    }
  );

  return await asyncGetCurrentAccountInformation();
};
