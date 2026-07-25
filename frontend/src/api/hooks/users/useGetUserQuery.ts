import { useQueryBase } from '../useQueryBase';
import { APIEndpoints } from '../../endpoints';
import type { IUser } from '@/types/user.types';

type GetUserResponse = { user: IUser };

export const useGetUserQuery = useQueryBase<GetUserResponse>(APIEndpoints.GET_USER, true, true);

export const useGetUser = (userId: string | null) => {
  const { data } = useGetUserQuery({
    queryKey: ['users', userId || ''],
    pathParams: { userId: userId || '' },
    enabled: !!userId,
  });

  return data?.data?.user ?? null;
};
