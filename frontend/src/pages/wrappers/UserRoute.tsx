import { useGetMeQuery } from '@/api/hooks/users/useGetMeQuery';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router';

export default function UserRoute() {
  const { data, isLoading, error } = useGetMeQuery({
    queryKey: ['users', 'me'],
  });
  const me = data?.data?.user;
  const isLoggedIn = !!me?._id;

  if (isLoading) return <div>Loading...</div>;
  if (
    !isLoggedIn ||
    (axios.isAxiosError(error) && error.response?.status === 401)
  )
    return <Navigate to='/' />;
  if (error) return <div>Error: {error.message}</div>;

  return <Outlet />;
}
