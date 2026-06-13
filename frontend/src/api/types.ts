export type HTTP_METHODS =
  | 'GET'
  | 'PATCH'
  | 'PUT'
  | 'POST'
  | 'DELETE'
  | 'OPTIONS';

type AUTH_ROUTES = 'LOGIN' | 'LOGOUT' | 'SIGNUP';
type USER_ROUTES = 'GET_ME' | 'UPDATE_ME' | 'GET_USER';
type ROOM_ROUTES = 'GET_ALL_ROOMS' | 'GET_ROOM_BY_ID';
type MESSAGE_ROUTES = 'GET_MESSAGES';

type API_ROUTES = AUTH_ROUTES | USER_ROUTES | ROOM_ROUTES | MESSAGE_ROUTES;

export type Endpoint = {
  URL: string;
  METHOD: HTTP_METHODS;
};

export type Endpoints = {
  [key in API_ROUTES]: Endpoint;
};

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T | undefined;
}

export interface APICursorResponse<T> {
  success: boolean;
  data: T & { nextCursor: string | null };
  message?: string;
}
