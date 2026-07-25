import { useMutationBase } from '../useMutationBase';
import { APIEndpoints } from '../../endpoints';
import type { APIResponse } from '@/api/types';
import type { IUser } from '@/types/user.types';

export interface TLoginMutationBody {
  email: string;
  password: string;
}

export type TLoginMutationResponse = APIResponse<{
  user: IUser;
}>;

export const useLoginMutation = useMutationBase<
  TLoginMutationBody,
  TLoginMutationResponse
>(APIEndpoints.LOGIN, 'Login', true);
