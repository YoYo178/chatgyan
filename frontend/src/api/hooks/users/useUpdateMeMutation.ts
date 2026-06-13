import { useMutationBase } from '../useMutationBase';
import { APIEndpoints } from '../../endpoints';
import type { APIResponse } from '@/api/types';
import type { IUser } from '@/types/user.types';

export interface TUpdateMeMutationBody {
  fullName: string;
  course?: string;
  year?: string;
}

export type TUpdateMeMutationResponse = APIResponse<{
  user: IUser;
}>;

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useUpdateMeMutation = useMutationBase<
  TUpdateMeMutationBody,
  TUpdateMeMutationResponse
>(APIEndpoints.UPDATE_ME, 'Update profile', true);