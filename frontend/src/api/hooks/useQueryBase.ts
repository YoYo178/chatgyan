import { queryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { API } from '../client';

import type { APIResponse, Endpoint } from '../types';
import { injectPathParams, injectQueryParams } from '../utils';

interface QueryBaseParams {
  queryKey?: string[];
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
  enabled?: boolean;
}

export const useQueryBase = <ResponseType>(
  endpoint: Endpoint,
  sendCookies: boolean = false,
  shouldRetry: boolean | ((failureCount: number, error: Error) => boolean) = false,
  staleTime: number | undefined = undefined,
) => {
  return <ResponseTypeOverride = ResponseType>({
    queryKey = [],
    pathParams,
    queryParams,
    enabled = true,
  }: QueryBaseParams) => {
    let URL = endpoint.URL;

    if (pathParams) URL = injectPathParams(URL, pathParams);
    if (queryParams) URL = injectQueryParams(URL, queryParams);

    return useQuery({
      ...queryOptions({
        queryKey: [...queryKey, sendCookies],
        queryFn: async ({ signal }) => {
          const response = await API.get<APIResponse<ResponseTypeOverride>>(URL, {
            withCredentials: sendCookies,
            signal,
          });
          return response?.data;
        },
      }),
      retry: (failureCount: number, error: Error) => {
        if (typeof shouldRetry === 'function') return shouldRetry(failureCount, error);

        if (axios.isAxiosError(error) && error.response?.status === 401) return false;

        return shouldRetry;
      },
      staleTime,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled,
    });
  };
};
