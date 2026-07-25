import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

import { API } from '../client';

import type { APICursorResponse, Endpoint } from '../types';
import { injectPathParams, injectQueryParams } from '../utils';

interface InfiniteQueryBaseParams {
  queryKey?: string[];
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
  enabled?: boolean;
}

export const useInfiniteQueryBase = <ResponseType>(
  endpoint: Endpoint,
  sendCookies: boolean = false,
  shouldRetry:
    | boolean
    | ((failureCount: number, error: Error) => boolean) = false,
  staleTime: number | undefined = undefined,
) => {
  return ({
    queryKey = [],
    pathParams,
    queryParams,
    enabled = true,
  }: InfiniteQueryBaseParams) => {
    let URL = endpoint.URL;

    if (pathParams) URL = injectPathParams(URL, pathParams);
    if (queryParams) URL = injectQueryParams(URL, queryParams);

    return useInfiniteQuery({
      ...infiniteQueryOptions({
        queryKey: [...queryKey],
        queryFn: async ({ pageParam }) => {
          let finalURL = endpoint.URL;

          if (pageParam.length)
            finalURL = injectQueryParams(finalURL, {
              ...queryParams,
              before: pageParam,
            });

          const response = await API.get<APICursorResponse<ResponseType>>(
            pageParam.length ? finalURL : URL,
            { withCredentials: sendCookies },
          );
          return response?.data;
        },

        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage.data.nextCursor,
      }),

      retry: (failureCount: number, error: Error) => {
        if (typeof shouldRetry === 'function')
          return shouldRetry(failureCount, error);

        if (axios.isAxiosError(error) && error.response?.status === 401)
          return false;

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
