import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError, type AxiosResponse } from 'axios';

import { API } from '../client';
import type { APIResponse, Endpoint } from '../types';
import { injectPathParams, injectQueryParams } from '../utils';

interface MutationBaseParams<PayloadType> {
  payload?: PayloadType;
  queryParams?: Record<string, string>;
  pathParams?: Record<string, string>;
}

export const useMutationBase = <PayloadType, ResponseType>(
  endpoint: Endpoint,
  actionName: string,
  sendAndAcceptCookies: boolean = false,
  options?: {
    optimisticUpdate?: (
      variables: { payload: PayloadType },
      oldData: unknown,
    ) => unknown;
  },
) => {
  return ({ queryKey = [] }: { queryKey?: string[] }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryClient = useQueryClient();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation({
      mutationFn: async ({
        payload,
        queryParams = {},
        pathParams = {},
      }: MutationBaseParams<PayloadType>) => {
        let URL = endpoint.URL;

        if (Object.keys(pathParams).length)
          URL = injectPathParams(URL, pathParams);

        if (Object.keys(queryParams).length)
          URL = injectQueryParams(URL, queryParams);

        let response: AxiosResponse<APIResponse<ResponseType>> | null = null;

        switch (endpoint.METHOD) {
          case 'POST':
            response = await API.post(URL, payload, {
              withCredentials: sendAndAcceptCookies,
            });
            break;

          case 'PUT':
            response = await API.put(URL, payload, {
              withCredentials: sendAndAcceptCookies,
            });
            break;

          case 'PATCH':
            response = await API.patch(URL, payload, {
              withCredentials: sendAndAcceptCookies,
            });
            break;

          case 'DELETE':
            response = await API.delete(URL, {
              withCredentials: sendAndAcceptCookies,
              data: payload,
            });
            break;

          case 'OPTIONS':
            response = await API.options(URL, {
              withCredentials: sendAndAcceptCookies,
            });
            break;
        }

        return response?.data || null;
      },

      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });

        const previousData = queryClient.getQueryData(queryKey);

        if (queryKey.length && options?.optimisticUpdate) {
          const updated = options.optimisticUpdate(
            variables as { payload: PayloadType },
            previousData,
          );
          queryClient.setQueryData(queryKey, updated);
        }

        return { previousData };
      },

      onError: (err, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData);
        }

        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<{ message: unknown }>;
          console.error(
            `${actionName} failed:`,
            error?.response?.data?.message,
          );
        } else if (err instanceof Error) {
          console.error(`${actionName} failed:`, err?.message);
        } else {
          console.error('Unknown error occurred', err);
        }
      },

      onSettled: (_data, _error, _variables, _context) => {
        if (!options?.optimisticUpdate) {
          queryClient.invalidateQueries({ queryKey });
        }
      },
    });
  };
};
