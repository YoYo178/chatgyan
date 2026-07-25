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

export const useUpdateMeMutation = useMutationBase<
  TUpdateMeMutationBody,
  TUpdateMeMutationResponse
>(APIEndpoints.UPDATE_ME, 'Update profile', true);