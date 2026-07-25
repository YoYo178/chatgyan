import { useGetMeQuery } from '@/api/hooks/users/useGetMeQuery';
import LoadingPage from '@/pages/LoadingPage';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router';

export default function GuestRoute() {
  const { data, isLoading, error } = useGetMeQuery({
    queryKey: ['users', 'me'],
  });
  const me = data?.data?.user;
  const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;
  const isLoggedIn = !isUnauthorized && !!me?._id;

  if (isLoading) return <LoadingPage />;
  if (error && !isUnauthorized) return <div>Error: {error.message}</div>;
  if (isLoggedIn) return <Navigate to='/dashboard' replace />;

  return <Outlet />;
}
