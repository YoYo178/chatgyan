import { APIEndpoints } from '@/api/endpoints';
import type { IMessage } from '@/types/message.types';
import { useInfiniteQueryBase } from '../useInfiniteQueryBase';

export const useGetMessagesQuery = useInfiniteQueryBase<{ messages: IMessage[] }>(
  APIEndpoints.GET_MESSAGES,
  true,
  true,
);
