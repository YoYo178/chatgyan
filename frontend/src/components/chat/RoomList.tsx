import CreateRoomModal from '@/components/chat/CreateRoomModal';
import { useGetRoomsQuery } from '@/api/hooks/rooms/useGetRoomsQuery';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { socket } from '@/api/socket';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useState, useMemo, useEffect } from 'react';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/api/socket/room.sockets';

export default function RoomList() {
  const queryClient = useQueryClient();
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const { data, isLoading, error } = useGetRoomsQuery({ queryKey: ['rooms'] });
  const rooms = useMemo(() => data?.data?.rooms ?? [], [data]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const selectedRoomId = useRoomsStore((state) => state.selectedRoomId);
  const setSelectedRoomId = useRoomsStore((state) => state.setSelectedRoomId);
  const joinedRoomId = useRoomsStore((state) => state.joinedRoomId);
  const setJoinedRoomId = useRoomsStore((state) => state.setJoinedRoomId);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (joinedRoomId && joinedRoomId !== roomId) {
      await new Promise<void>((resolve) => {
        socket.emit('leaveRoom', joinedRoomId, ({ success }) => {
          if (success) {
            setJoinedRoomId(null);
            // Clean up room events for the old room
            stopListeningRoomEvents(socket);

            queryClient.invalidateQueries({
              ...queryOptions({ queryKey: ['rooms'] })
            });
            queryClient.invalidateQueries({
              ...queryOptions({ queryKey: ['users', 'me'] })
            });
          }
          resolve();
        });
      });
    }

    // Now join the requested room
    socket.emit(
      'joinRoom',
      { method: 'id', data: roomId },
      ({ success, data }) => {
        if (success && data?.roomId) {
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['rooms'] })
          });
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['users', 'me'] })
          });
          startListeningRoomEvents(socket, queryClient);

          setJoinedRoomId(data.roomId);
          setSelectedRoomId(null);
        }
      },
    );
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 200);
    return () => clearTimeout(t);
  }, [search]);

  const filteredRooms = useMemo(() => {
    if (!debouncedSearch) return rooms;
    const q = debouncedSearch.toLowerCase();
    return rooms.filter((r) => {
      return (
        (r.name && r.name.toLowerCase().includes(q)) ||
        ('code' in r &&
          typeof r.code === 'string' &&
          r.code.toLowerCase().includes(q))
      );
    });
  }, [rooms, debouncedSearch]);

  return (
    <aside className='flex h-full flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/30 backdrop-blur lg:h-full lg:min-h-0'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-xs uppercase tracking-[0.24em] text-emerald-300/70'>
            Rooms
          </p>
          <h2 className='chat-display-font text-lg font-semibold text-slate-100'>
            Your spaces
          </h2>
        </div>
        <button
          type='button'
          onClick={() => setIsCreateRoomOpen(true)}
          className='inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/30'
        >
          <IconPlus className='h-4 w-4' />
          Create
        </button>
      </div>

      <label className='flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 focus-within:border-emerald-400/60'>
        <IconSearch className='h-4 w-4 text-slate-500' />
        <input
          placeholder='Search rooms'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none'
        />
      </label>

      <div className='flex flex-col gap-4 overflow-y-auto'>
        {isLoading && (
          <p className='rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-400'>
            Loading rooms...
          </p>
        )}

        {error && !isLoading && (
          <p className='rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
            Unable to load rooms.
          </p>
        )}

        {!isLoading && !error && filteredRooms.length === 0 && (
          <p className='rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-400'>
            {search ? 'No rooms match your search.' : 'No rooms found.'}
          </p>
        )}

        {!isLoading &&
          !error &&
          filteredRooms.map((room) => {
            const isActive = selectedRoomId === room._id;

            return (
              <button
                key={room._id}
                type='button'
                onClick={() => handleSelectRoom(room._id)}
                onDoubleClick={() => handleJoinRoom(room._id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${isActive
                  ? 'border-emerald-400/50 bg-emerald-400/10 text-slate-100'
                  : 'border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
              >
                <div className='w-full flex flex-col gap-1'>
                  <div className='w-full flex gap-2 justify-between'>
                    <p className='font-semibold text-slate-100'>{room.name}</p>
                    {room.isSystemGenerated ? (
                      <span className='bg-emerald-400/10 text-emerald-200 px-2.5 py-0.5 rounded-full text-xs w-fit h-fit'>
                        System
                      </span>
                    ) : (
                      <>
                        <span className='bg-emerald-400/10 text-emerald-200 px-2.5 py-0.5 rounded-full text-xs w-fit h-fit'>
                          {room.type?.length
                            ? room?.type?.at(0)?.toUpperCase() +
                            room.type?.slice(1)
                            : ''}{' '}
                        </span>
                      </>
                    )}
                  </div>

                  <p className='text-xs font-medium text-slate-400'>
                    {room.typeName}
                  </p>
                  <p className='text-xs text-slate-500'>
                    {room.memberCount}{' '}
                    {room.memberCount === 1 ? 'student' : 'students'}
                  </p>
                </div>
              </button>
            );
          })}
      </div>

      <CreateRoomModal
        open={isCreateRoomOpen}
        onOpenChange={setIsCreateRoomOpen}
      />
    </aside>
  );
}
