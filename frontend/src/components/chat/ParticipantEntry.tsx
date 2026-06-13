import { useGetUser } from '@/api/hooks/users/useGetUserQuery';
import { IconCircleFilled } from '@tabler/icons-react';

interface ParticipantEntryProps {
  userId: string;
  roomRole: 'admin' | 'member';
  joinTimestamp: number;
  isCurrentUser?: boolean;
}

const formatJoinTime = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function ParticipantEntry({
  userId,
  roomRole,
  joinTimestamp,
  isCurrentUser = false,
}: ParticipantEntryProps) {
  const user = useGetUser(userId);

  const displayName = user?.fullName || user?.username || userId;
  const initials = getInitials(displayName);

  return (
    <div className='flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200'>
          <span className='text-sm font-semibold'>{initials}</span>
        </div>
        <div>
          <p className='text-sm font-semibold text-slate-100 wrap-anywhere'>
            {displayName}
            {isCurrentUser ? ' (You)' : ''}
          </p>
          {user?.username && (
            <p className='text-xs text-slate-500 wrap-anywhere'>@{user?.username}</p>
          )}
          <p className='text-xs text-slate-500'>
            Joined {formatJoinTime(joinTimestamp)}
          </p>
        </div>
      </div>

      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
          roomRole === 'admin'
            ? 'bg-emerald-400/15 text-emerald-200'
            : 'bg-slate-800/80 text-slate-300'
        }`}
      >
        <IconCircleFilled className='h-2 w-2' />
        {roomRole === 'admin' ? 'Admin' : 'Member'}
      </span>
    </div>
  );
}
