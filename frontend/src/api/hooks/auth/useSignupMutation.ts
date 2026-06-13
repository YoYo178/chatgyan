import { useMutationBase } from '../useMutationBase';
import { APIEndpoints } from '../../endpoints';

export interface TSignupMutationBody {
  fullName: string;
  email: string;
  password: string;
}

export interface TSignupMutationResponse {
  user: {
    _id: string;
  };
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useSignupMutation = useMutationBase<
  TSignupMutationBody,
  TSignupMutationResponse
>(APIEndpoints.SIGNUP, 'Sign up', true);
