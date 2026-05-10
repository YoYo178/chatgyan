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

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useLoginMutation = useMutationBase<
  TLoginMutationBody,
  TLoginMutationResponse
>(APIEndpoints.LOGIN, 'Login', true);
