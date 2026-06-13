import { useGetUser } from '@/api/hooks/users/useGetUserQuery';
import { useMe } from '@/api/hooks/users/useGetMeQuery';
import type { IMessage } from '@/types/message.types';
import type { ReactNode } from 'react';

interface MessageBubbleProps {
  message: IMessage;
  renderContent: (text: string) => ReactNode[];
}

const formatMessageTime = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));

export default function MessageBubble({
  message,
  renderContent,
}: MessageBubbleProps) {
  const me = useMe();
  const sender = useGetUser(message.sender);
  const isCurrentUser = me?._id === message.sender;
  const author =
    sender?.fullName || sender?.username || (isCurrentUser ? 'You' : 'Member');

  return (
    <div
      className={`flex flex-col gap-2 ${
        isCurrentUser ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-lg ${
          isCurrentUser
            ? 'bg-emerald-400/20 text-emerald-50 shadow-emerald-500/20'
            : 'bg-slate-950/60 text-slate-100 shadow-slate-950/50'
        }`}
      >
        <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>
          {author}
        </p>
        <p className='mt-1 leading-relaxed'>
          {renderContent(message.content)}
        </p>
      </div>
      <span
        className={`text-xs text-slate-500 ${isCurrentUser ? 'me-4' : 'ms-4'}`}
      >
        {formatMessageTime(message.createdAt)}
      </span>
    </div>
  );
}
