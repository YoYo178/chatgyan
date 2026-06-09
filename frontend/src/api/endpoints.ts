import type { Endpoints } from './types';

// Endpoints config
export const APIEndpoints: Endpoints = {
  // Auth routes
  LOGIN: {
    METHOD: 'POST',
    URL: '/auth/login',
  },
  LOGOUT: {
    METHOD: 'POST',
    URL: '/auth/logout',
  },
  SIGNUP: {
    METHOD: 'POST',
    URL: '/auth/signup',
  },

  // User routes
  GET_ME: {
    METHOD: 'GET',
    URL: '/users/me',
  },
  UPDATE_ME: {
    METHOD: 'PATCH',
    URL: '/users/me',
  },
  GET_USER: {
    METHOD: 'GET',
    URL: '/users/:userId',
  },
  
  // Room routes
  GET_ALL_ROOMS: {
    METHOD: 'GET',
    URL: '/rooms',
  },
  GET_ROOM_BY_ID: {
    METHOD: 'GET',
    URL: '/rooms/:roomId',
  },
};
