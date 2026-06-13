import { useMutationBase } from '../useMutationBase';
import { APIEndpoints } from '../../endpoints';

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useLogoutMutation = useMutationBase(
  APIEndpoints.LOGOUT,
  'Log out',
  true,
);
