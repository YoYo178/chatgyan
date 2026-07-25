import { useMutationBase } from '../useMutationBase';
import { APIEndpoints } from '../../endpoints';

export const useLogoutMutation = useMutationBase(APIEndpoints.LOGOUT, 'Log out', true);
