import { useLogoutMutation } from '@/api/hooks/auth/useLogoutMutation';
import { useMe } from '@/api/hooks/users/useGetMeQuery';
import ProfileModal from '@/components/chat/ProfileModal';
import { IconLogout, IconSchool, IconUserCircle } from '@tabler/icons-react';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function ChatNavbar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync } = useLogoutMutation({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const me = useMe();

  const handleLogout = async () => {
    await mutateAsync({});
    queryClient.removeQueries({ ...queryOptions({ queryKey: ['users'] }) });
    navigate('/', { replace: true });
  };

  return (
    <nav className='flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 px-5 py-4 shadow-lg shadow-slate-950/30 backdrop-blur'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300'>
          <IconSchool className='h-6 w-6' />
        </div>
        <div className='chat-display-font'>
          <p className='text-lg uppercase tracking-[0.24em] text-emerald-300/80'>ChatGyan</p>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-900/60 px-3 py-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200'>
            <span className='text-sm font-semibold'>
              {me?.fullName ? me.fullName.charAt(0) + me.fullName.split(' ')[1]?.charAt(0) : '?'}
            </span>
          </div>
          <div className='hidden sm:block'>
            <p className='text-sm font-semibold text-slate-100'>
              {me?.fullName || 'Error fetching name'}
            </p>
            <p className='text-xs text-slate-400'>
              {me?.course} · {me?.year !== '-' ? `Year ${me?.year}` : me?.year}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400/60 hover:text-sky-200'
            onClick={() => setIsProfileOpen(true)}
          >
            <IconUserCircle className='h-5 w-5' />
            Profile
          </button>
          <button
            className='inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-400/60 hover:text-rose-200'
            onClick={handleLogout}
          >
            <IconLogout className='h-5 w-5' />
            Log out
          </button>
        </div>
      </div>

      <ProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </nav>
  );
}
