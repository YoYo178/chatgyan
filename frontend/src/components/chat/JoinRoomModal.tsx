import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { socket } from '@/api/socket';
import { startListeningRoomEvents } from '@/api/socket/room.sockets';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { IconX, IconHash } from '@tabler/icons-react';

interface JoinRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JoinRoomModal({ open, onOpenChange }: JoinRoomModalProps) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const joinedRoomId = useRoomsStore((state) => state.joinedRoomId);
  const setJoinedRoomId = useRoomsStore((state) => state.setJoinedRoomId);
  const setSelectedRoomId = useRoomsStore((state) => state.setSelectedRoomId);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setCode('');
    setError(null);
    onOpenChange(false);
  }, [isLoading, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isLoading, handleClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleJoin = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a room code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Leave current room first if needed
      if (joinedRoomId) {
        await new Promise<void>((resolve) => {
          socket.emit('leaveRoom', joinedRoomId, ({ success }) => {
            if (success) {
              setJoinedRoomId(null);
              queryClient.invalidateQueries({
                ...queryOptions({ queryKey: ['rooms'] }),
              });
              queryClient.invalidateQueries({
                ...queryOptions({ queryKey: ['users', 'me'] }),
              });
            }
            resolve();
          });
        });
      }

      // Join via code
      socket.emit(
        'joinRoom',
        { method: 'code', data: trimmed },
        ({ success, data, error: socketError }) => {
          setIsLoading(false);
          if (success && data?.roomId) {
            queryClient.invalidateQueries({
              ...queryOptions({ queryKey: ['rooms'] }),
            });
            queryClient.invalidateQueries({
              ...queryOptions({ queryKey: ['users', 'me'] }),
            });
            startListeningRoomEvents(socket, queryClient);
            setJoinedRoomId(data.roomId);
            setSelectedRoomId(data.roomId);
            handleClose();
          } else {
            setError(socketError ?? 'Failed to join room. Check the code and try again.');
          }
        },
      );
    } catch {
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  const modal = (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-0 backdrop-blur-sm sm:items-center sm:px-4'>
      <button
        type='button'
        aria-label='Close join room dialog'
        className='absolute inset-0 cursor-default'
        onClick={handleClose}
      />

      <div className='relative z-10 w-full rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 sm:max-w-md sm:rounded-3xl sm:p-6'>
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div className='space-y-2'>
            <p className='text-xs uppercase tracking-[0.28em] text-emerald-300/70'>Rooms</p>
            <h3 className='chat-display-font text-2xl font-semibold text-slate-50'>
              Join via code
            </h3>
            <p className='text-sm leading-6 text-slate-400'>
              Enter a room code to join a public or a private room.
            </p>
          </div>
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>

        <label className='flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
          <IconHash className='h-4 w-4 shrink-0 text-slate-500' />
          <input
            autoFocus
            placeholder='Enter room code'
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJoin();
            }}
            className='w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none'
          />
        </label>

        {error && (
          <p className='mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'>
            {error}
          </p>
        )}

        <div className='mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            className='inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleJoin}
            disabled={isLoading || !code.trim()}
            className='inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading ? 'Joining…' : 'Join room'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
