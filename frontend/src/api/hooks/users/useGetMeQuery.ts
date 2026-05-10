import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../endpoints';
import type { IUser } from '@/types/user.types';

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useGetMeQuery = useQueryBase<{ user: IUser }>(
  APIEndpoints.GET_ME,
  true,
  true,
);

export const useMe = () => {
  const { data } = useGetMeQuery({ queryKey: ['users', 'me'] });
  return data?.data?.user;
};
