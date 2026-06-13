import { APIEndpoints } from '@/api/endpoints';
import type { IMessage } from '@/types/message.types';
import { useInfiniteQueryBase } from '../useInfiniteQueryBase';

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useGetMessagesQuery = useInfiniteQueryBase<{ messages: IMessage[] }>(
  APIEndpoints.GET_MESSAGES,
  true,
  true,
);