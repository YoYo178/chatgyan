import { useGetMeQuery } from '@/api/hooks/users/useGetMeQuery';
import { useGetRoomByIdQuery } from '@/api/hooks/rooms/useGetRoomByIdQuery';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import ParticipantEntry from '@/components/chat/ParticipantEntry';
import { IconSparkles } from '@tabler/icons-react';
import type { IRoom } from '@/types/room.types';

export default function ParticipantsPanel() {
  const joinedRoomId = useRoomsStore((state) => state.joinedRoomId);
  const { data: meData } = useGetMeQuery({ queryKey: ['users', 'me'] });

  const {
    data: roomData,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomByIdQuery({
    queryKey: ['rooms', joinedRoomId || ''],
    pathParams: { roomId: joinedRoomId || '' },
    enabled: !!joinedRoomId,
  });

  const room = (roomData?.data?.room as IRoom | undefined) ?? null;
  const me = meData?.data?.user ?? null;

  return (
    <aside className='flex h-full flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30 backdrop-blur lg:h-full lg:min-h-0'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-xs uppercase tracking-[0.24em] text-emerald-300/70'>
            Members
          </p>
          <h2 className='chat-display-font text-lg font-semibold text-slate-100'>
            {room?.name ? `${room.name} roster` : 'In this room'}
          </h2>
          {room && (
            <p className='mt-1 text-xs text-slate-500'>
              {room.memberCount} / {room.memberLimit} students
            </p>
          )}
        </div>
      </div>

      <div className='space-y-3 overflow-y-auto'>
        {!joinedRoomId && (
          <div className='text-center rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-400'>
            Join a room to view its members.
          </div>
        )}

        {joinedRoomId && isRoomLoading && (
          <div className='rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-400'>
            Loading members from the backend...
          </div>
        )}

        {joinedRoomId && isRoomError && !isRoomLoading && (
          <div className='rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
            Unable to load the selected room.
          </div>
        )}

        {room && (room.members?.length ?? 0) === 0 && (
          <div className='rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-400'>
            No members found in this room.
          </div>
        )}

        {room?.members?.map((member) => (
          <ParticipantEntry
            key={member.user}
            userId={member.user}
            roomRole={member.roomRole}
            joinTimestamp={member.joinTimestamp}
            isCurrentUser={me?._id === member.user}
          />
        ))}
      </div>

      <div className='mt-auto rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4'>
        <div className='flex items-center gap-2 text-sm text-slate-200'>
          <IconSparkles className='h-4 w-4 text-emerald-300' />
          Session focus
        </div>
        <p className='mt-2 text-sm text-slate-400'>
          Keep questions tagged with the assignment number for easier
          follow-ups.
        </p>
      </div>
    </aside>
  );
}
