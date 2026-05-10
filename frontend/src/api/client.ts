import axios from 'axios';

const isProduction = import.meta.env.PROD;

export const SERVER_URL = isProduction
  ? import.meta.env.VITE_SERVER_URL
  : import.meta.env.VITE_DEV_SERVER_URL;

export const API_URL = SERVER_URL + `${isProduction ? '/eduzone/api' : '/api'}`;

export const API = axios.create({
  baseURL: API_URL,
});
