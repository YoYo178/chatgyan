import ChatInput from '@/components/chat/ChatInput';
import EditRoomModal from '@/components/chat/EditRoomModal';
import MessageBubble from '@/components/chat/MessageBubble';
import { useGetMessagesQuery } from '@/api/hooks/messages/useGetMessagesQuery';
import { useGetRoomByIdQuery } from '@/api/hooks/rooms/useGetRoomByIdQuery';
import { useGetMeQuery } from '@/api/hooks/users/useGetMeQuery';
import { socket } from '@/api/socket';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import type { IMessage } from '@/types/message.types';
import type { IRoom } from '@/types/room.types';
import {
  IconBook,
  IconCalendar,
  IconChevronDown,
  IconDoorExit,
  IconExternalLink,
  IconHash,
  IconLink,
  IconPencil,
  IconSparkles,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  startListeningRoomEvents,
  stopListeningRoomEvents,
} from '@/api/socket/room.sockets';

const linkPattern = /https?:\/\/[^\s<]+/gi;

function getRoomSummary(room: IRoom | null) {
  if (!room) return null;

  return {
    label: room.isSystemGenerated
      ? 'System room'
      : room.type === 'course'
        ? 'Course room'
        : 'Topic room',
    visibilityLabel:
      room.visibility === 'public' ? 'Public room' : 'Private room',
    membersLabel: `${room.memberCount} / ${room.memberLimit} students`,
  };
}

function renderMessageContent(
  text: string,
  onLinkClick: (url: string) => void,
): ReactNode[] {
  const parts: ReactNode[] = [];
  const matches = Array.from(text.matchAll(linkPattern));
  let lastIndex = 0;

  for (const match of matches) {
    const matchedText = match[0];
    const startIndex = match.index ?? 0;
    const trailingMatch = matchedText.match(/[.,!?;:)]+$/)?.[0] ?? '';
    const cleanUrl = matchedText.slice(
      0,
      matchedText.length - trailingMatch.length,
    );

    if (startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, startIndex));
    }

    parts.push(
      <button
        key={`${cleanUrl}-${startIndex}`}
        type='button'
        onClick={() => onLinkClick(cleanUrl)}
        className='inline-flex items-center gap-1 rounded-full border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 font-medium text-sky-200 underline decoration-sky-300/60 underline-offset-4 transition hover:border-sky-300/40 hover:bg-sky-400/20 hover:text-sky-100'
      >
        <IconLink className='h-3.5 w-3.5' />
        {cleanUrl}
      </button>,
    );

    if (trailingMatch) {
      parts.push(trailingMatch);
    }

    lastIndex = startIndex + matchedText.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function flattenMessages(
  pages: { data?: { messages?: IMessage[] } }[] | undefined,
) {
  if (!pages?.length) return [];

  const seen = new Set<string>();
  const flattened: IMessage[] = [];

  for (const page of [...pages].reverse()) {
    for (const message of page.data?.messages ?? []) {
      if (seen.has(message._id)) continue;

      seen.add(message._id);
      flattened.push(message);
    }
  }

  return flattened;
}

export default function ChatWindow() {
  const queryClient = useQueryClient();
  const selectedRoomId = useRoomsStore((state) => state.selectedRoomId);
  const joinedRoomId = useRoomsStore((state) => state.joinedRoomId);
  const setJoinedRoomId = useRoomsStore((state) => state.setJoinedRoomId);
  const setSelectedRoomId = useRoomsStore((state) => state.setSelectedRoomId);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isRoomHeaderExpanded, setIsRoomHeaderExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef(0);
  const hasScrolledToBottomRef = useRef(false);
  const previousMessageCountRef = useRef(0);

  const activeRoomId = selectedRoomId || joinedRoomId;
  const isJoinedActiveRoom = !!joinedRoomId && activeRoomId === joinedRoomId;

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetMessagesQuery({
    queryKey: ['messages', joinedRoomId || ''],
    queryParams: { roomId: joinedRoomId || '' },
    enabled: !!joinedRoomId && isJoinedActiveRoom,
  });

  const messages = useMemo(
    () => flattenMessages(messagesData?.pages),
    [messagesData?.pages],
  );

  const {
    data: roomData,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useGetRoomByIdQuery({
    queryKey: ['rooms', activeRoomId || ''],
    pathParams: { roomId: activeRoomId || '' },
    enabled: !!activeRoomId,
  });

  const { data: meData } = useGetMeQuery({ queryKey: ['users', 'me'] });

  const room = (roomData?.data?.room as IRoom | undefined) ?? null;
  const me = meData?.data?.user ?? null;
  const roomSummary = useMemo(() => getRoomSummary(room), [room]);
  const isRoomAdmin = useMemo(() => {
    if (!room || !me || room.isSystemGenerated) return false;

    return room.owner === me?._id;
  }, [me, room]);

  const isNearBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      120
    );
  };

  useEffect(() => {
    hasScrolledToBottomRef.current = false;
    previousMessageCountRef.current = 0;
    setIsRoomHeaderExpanded(false);
  }, [joinedRoomId]);

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isFetchingNextPage) {
          previousScrollHeightRef.current = container.scrollHeight;
          fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: '120px 0px 0px 0px',
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, joinedRoomId]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !previousScrollHeightRef.current || isFetchingNextPage) {
      return;
    }

    const heightDelta =
      container.scrollHeight - previousScrollHeightRef.current;
    if (heightDelta > 0) {
      container.scrollTop += heightDelta;
    }

    previousScrollHeightRef.current = 0;
  }, [isFetchingNextPage, messages.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !messages.length) return;

    const previousCount = previousMessageCountRef.current;
    const shouldScrollToBottom =
      !hasScrolledToBottomRef.current ||
      (messages.length > previousCount && isNearBottom());

    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      hasScrolledToBottomRef.current = true;
    }

    previousMessageCountRef.current = messages.length;
  }, [messages.length, joinedRoomId]);

  const handleJoinSelectedRoom = async () => {
    if (!activeRoomId || isJoinedActiveRoom) return;

    if (joinedRoomId && joinedRoomId !== activeRoomId) {
      await new Promise<void>((resolve) => {
        socket.emit('leaveRoom', joinedRoomId, ({ success }) => {
          if (success) {
            // Clean up room events for the old room
            stopListeningRoomEvents(socket);

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

    socket.emit(
      'joinRoom',
      { method: 'id', data: activeRoomId },
      ({ success, data }) => {
        if (success && data?.roomId) {
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['rooms'] }),
          });
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['users', 'me'] }),
          });
          startListeningRoomEvents(socket, queryClient);
          setJoinedRoomId(selectedRoomId);
          setSelectedRoomId(null);

          setJoinedRoomId(data.roomId);
          setSelectedRoomId(data.roomId);
        }
      },
    );
  };

  const handleCancelSelection = () => {
    if (selectedRoomId && selectedRoomId !== joinedRoomId) {
      setSelectedRoomId(null);
    }
  };

  useEffect(() => {
    if (!pendingLink && !isEditModalOpen && !isDeleteModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPendingLink(null);
        setIsEditModalOpen(false);
        if (!isDeleting) {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDeleteModalOpen, isDeleting, isEditModalOpen, pendingLink]);

  const handleLeaveRoom = async () => {
    if (!joinedRoomId || isLeaving) return;

    setIsLeaving(true);

    await new Promise<void>((resolve) => {
      socket.emit('leaveRoom', joinedRoomId, ({ success }) => {
        if (success) {
          setJoinedRoomId(null);
          setSelectedRoomId(null);
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['rooms'] }),
          });
        }

        resolve();
      });
    });

    setIsLeaving(false);
  };

  const handleDeleteRoom = async () => {
    if (!joinedRoomId || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    await new Promise<void>((resolve) => {
      socket.emit('deleteRoom', joinedRoomId, ({ success, error }) => {
        if (success) {
          setJoinedRoomId(null);
          setSelectedRoomId(null);
          setIsDeleteModalOpen(false);
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['rooms'] }),
          });
          queryClient.invalidateQueries({
            ...queryOptions({ queryKey: ['users', 'me'] }),
          });
        } else {
          setDeleteError(error ?? 'Unable to delete this room.');
        }

        setIsDeleting(false);
        resolve();
      });
    });
  };

  const linkDialog = pendingLink
    ? createPortal(
        <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-0 backdrop-blur-sm sm:items-center sm:px-4'>
          <button
            type='button'
            aria-label='Close link dialog'
            className='absolute inset-0 cursor-default'
            onClick={() => setPendingLink(null)}
          />

          <div className='relative z-10 w-full rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 sm:max-w-lg sm:rounded-3xl sm:p-6'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div className='space-y-2'>
                <p className='text-xs uppercase tracking-[0.28em] text-sky-300/70'>
                  External link
                </p>
                <h3 className='chat-display-font text-2xl font-semibold text-slate-50'>
                  Open this resource?
                </h3>
                <p className='text-sm leading-6 text-slate-400'>
                  Students often share notes, docs, or video references. Review
                  the link before you continue.
                </p>
              </div>

              <button
                type='button'
                onClick={() => setPendingLink(null)}
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-slate-100'
              >
                <IconX className='h-5 w-5' />
              </button>
            </div>

            <div className='rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300'>
              <p className='text-xs uppercase tracking-[0.22em] text-slate-500'>
                Destination
              </p>
              <p className='mt-2 break-all font-medium text-slate-100'>
                {pendingLink}
              </p>
            </div>

            <div className='mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={() => setPendingLink(null)}
                className='inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  if (pendingLink) {
                    window.open(pendingLink, '_blank', 'noopener,noreferrer');
                  }
                  setPendingLink(null);
                }}
                className='inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/15 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-400/20'
              >
                Open link
                <IconExternalLink className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  const deleteDialog = isDeleteModalOpen
    ? createPortal(
        <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-0 backdrop-blur-sm sm:items-center sm:px-4'>
          <button
            type='button'
            aria-label='Close delete room dialog'
            className='absolute inset-0 cursor-default'
            onClick={() => {
              if (isDeleting) return;
              setIsDeleteModalOpen(false);
              setDeleteError(null);
            }}
          />

          <div className='relative z-10 w-full rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 sm:max-w-lg sm:rounded-3xl sm:p-6'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div className='space-y-2'>
                <p className='text-xs uppercase tracking-[0.28em] text-rose-300/70'>
                  Delete room
                </p>
                <h3 className='chat-display-font text-2xl font-semibold text-slate-50'>
                  Delete this room permanently?
                </h3>
                <p className='text-sm leading-6 text-slate-400'>
                  This action cannot be undone. All messages will be removed and
                  every member will be disconnected from the study session.
                </p>
              </div>

              <button
                type='button'
                onClick={() => {
                  if (isDeleting) return;
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
              >
                <IconX className='h-5 w-5' />
              </button>
            </div>

            <div className='rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300'>
              <p className='text-xs uppercase tracking-[0.22em] text-slate-500'>
                Room to delete
              </p>
              <p className='mt-2 font-medium text-slate-100'>
                {room?.name ?? 'Study room'}
              </p>
              <p className='mt-1 text-xs text-slate-500'>
                {room?.typeName ?? 'Room details'} ·{' '}
                {roomSummary?.membersLabel ?? 'Members unavailable'}
              </p>
            </div>

            {deleteError && (
              <p className='mt-4 text-sm text-rose-300'>{deleteError}</p>
            )}

            <div className='mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className='inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteRoom}
                disabled={isDeleting}
                className='inline-flex items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/15 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60'
              >
                <IconTrash className='h-4 w-4' />
                {isDeleting ? 'Deleting...' : 'Delete room'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  if (!activeRoomId) {
    return (
      <section className='flex h-full flex-col rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur lg:h-full lg:min-h-0'>
        <div className='flex h-full flex-1 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-800/80 bg-slate-950/45 p-6'>
          <div className='max-w-md text-center'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300'>
              <IconSparkles className='h-7 w-7' />
            </div>
            <p className='text-xs uppercase tracking-[0.28em] text-emerald-300/70'>
              No room joined
            </p>
            <h2 className='chat-display-font mt-3 text-2xl font-semibold text-slate-50'>
              Join a study room to start chatting
            </h2>
            <p className='mt-3 text-sm leading-6 text-slate-400'>
              Single-click a room from the left panel to preview it here, then
              join the room when you are ready.
            </p>
            <p className='mt-3 text-sm leading-6 text-slate-400'>
              Alternatively, double click a room to join it directly. Once you
              are inside, you will see the room details, the roster, and the
              chat thread for respective topic.
            </p>
          </div>
        </div>

        {linkDialog}
        <EditRoomModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          room={room}
        />
      </section>
    );
  }

  if (!isJoinedActiveRoom && room) {
    return (
      <section className='flex h-full items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur lg:h-full lg:min-h-0'>
        <div className='w-full h-full flex flex-col rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/40 sm:p-6'>
          <div className='mb-5 flex items-start justify-between gap-4'>
            <div className='space-y-2'>
              <p className='text-xs uppercase tracking-[0.24em] text-slate-400'>
                Room preview
              </p>
              <h2 className='chat-display-font text-2xl font-semibold text-slate-50'>
                {room.name}
              </h2>
              <p className='text-sm text-slate-400'>
                {room.typeName} · {roomSummary?.label ?? 'Study room'}
              </p>
              <p className='text-xs text-slate-500'>
                {roomSummary?.membersLabel} · {roomSummary?.visibilityLabel}
              </p>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4'>
              <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
                Room type
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-100'>
                {roomSummary?.label ?? 'Study room'}
              </p>
              <p className='mt-1 text-xs text-slate-400'>{room.typeName}</p>
            </div>

            <div className='rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4'>
              <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
                Room details
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-100'>
                {roomSummary?.membersLabel}
              </p>
              <p className='mt-1 text-xs text-slate-400'>
                {roomSummary?.visibilityLabel}
              </p>
            </div>
          </div>

          <div className='mt-auto flex flex-col gap-4'>
            {room.visibility === 'private' && room.owner !== me?._id && (
              <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
                    Notice
                  </p>
                  <p className='text-sm text-slate-300'>
                    This room cannot be joined directly from the room browser.
                    You must obtain the room code from the room owner and join
                    using that code.
                  </p>
                </div>
              </div>
            )}
            <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3'>
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
                  Room actions
                </p>
                <p className='text-sm text-slate-300'>
                  Join this room or cancel the selection.
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <button
                  type='button'
                  onClick={handleJoinSelectedRoom}
                  className='inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-400/20 disabled:text-muted-foreground disabled:hover:bg-emerald-400/15 disabled:hover:border-emerald-400/30 disabled:cursor-not-allowed'
                  disabled={room.visibility === 'private'}
                >
                  Join
                </button>
                <button
                  type='button'
                  onClick={handleCancelSelection}
                  className='inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-50'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='flex h-full flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur lg:h-full lg:min-h-0'>
      <header className='shrink-0 rounded-2xl border border-slate-800/70 bg-slate-950/40'>
        <button
          type='button'
          onClick={() => setIsRoomHeaderExpanded((expanded) => !expanded)}
          aria-expanded={isRoomHeaderExpanded}
          aria-controls='room-header-details'
          className='flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-slate-900/40 sm:px-4 sm:py-3'
        >
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-800/80 bg-slate-900/70 text-slate-300 transition-transform duration-300 ${
              isRoomHeaderExpanded ? 'rotate-180' : ''
            }`}
          >
            <IconChevronDown className='h-4 w-4' />
          </span>

          <div className='min-w-0 flex-1'>
            <p className='text-[0.65rem] uppercase tracking-[0.24em] text-slate-400 sm:text-xs'>
              Current room
            </p>
            <h2 className='chat-display-font truncate text-base font-semibold text-slate-50 sm:text-xl'>
              {room?.name ?? 'Study room'}
            </h2>
            {!isRoomHeaderExpanded && (
              <p className='truncate text-xs text-slate-400 sm:text-sm'>
                {room?.typeName ?? 'Room details'}
                {roomSummary?.membersLabel
                  ? ` · ${roomSummary.membersLabel}`
                  : ''}
              </p>
            )}
          </div>

          {!isRoomHeaderExpanded && (
            <span className='hidden shrink-0 items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 sm:inline-flex'>
              <IconHash className='h-3.5 w-3.5 text-emerald-300' />
              {room?.code ?? 'Room code'}
            </span>
          )}
        </button>

        <div
          id='room-header-details'
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isRoomHeaderExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className='overflow-hidden'>
            <div className='space-y-3 border-t border-slate-800/70 px-3 pb-3 pt-3 sm:px-4 sm:pb-4'>
              <div className='flex flex-col gap-3 lg:flex-row lg:justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm text-slate-400'>
                    {room?.typeName ?? 'Room details'} ·{' '}
                    {roomSummary?.label ?? 'Room'}
                  </p>
                  {room && (
                    <p className='text-xs text-slate-500'>
                      {roomSummary?.membersLabel} ·{' '}
                      {roomSummary?.visibilityLabel}
                    </p>
                  )}
                </div>

                <div className='flex flex-wrap items-center gap-2 text-xs text-slate-300 sm:gap-3'>
                  <span className='inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-2'>
                    <IconHash className='h-4 w-4 text-emerald-300' />
                    {room?.code ?? 'Room code'}
                  </span>
                  <span className='inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-2'>
                    <IconBook className='h-4 w-4 text-sky-300' />
                    {roomSummary?.label ?? 'Study space'}
                  </span>
                  <span className='inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-2'>
                    <IconCalendar className='h-4 w-4 text-violet-300' />
                    Keep your notes synced
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>
                    Room actions
                  </p>
                  <p className='text-sm text-slate-300'>
                    Review room settings or leave the study session.
                  </p>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  {isRoomAdmin && (
                    <>
                      <button
                        type='button'
                        onClick={() => {
                          setDeleteError(null);
                          setIsDeleteModalOpen(true);
                        }}
                        className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/20 px-4 py-2.5 text-sm font-semibold text-rose-50 transition hover:border-rose-400/60 hover:bg-rose-500/30 sm:w-auto'
                      >
                        <IconTrash className='h-4 w-4' />
                        Delete
                      </button>
                      <button
                        type='button'
                        onClick={() => setIsEditModalOpen(true)}
                        className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/15 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-400/20 sm:w-auto'
                      >
                        <IconPencil className='h-4 w-4' />
                        Edit
                      </button>
                    </>
                  )}
                  <button
                    type='button'
                    onClick={handleLeaveRoom}
                    disabled={isLeaving}
                    className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'
                  >
                    <IconDoorExit className='h-4 w-4' />
                    {isLeaving ? 'Leaving...' : 'Leave'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        className='flex-1 space-y-4 overflow-y-auto pr-2'
      >
        {isRoomLoading && (
          <div className='rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-400'>
            Loading room details...
          </div>
        )}

        {isRoomError && !isRoomLoading && (
          <div className='rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
            Unable to load the selected room.
          </div>
        )}

        {isMessagesLoading && (
          <div className='rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3 text-sm text-slate-400'>
            Loading messages...
          </div>
        )}

        {isMessagesError && !isMessagesLoading && (
          <div className='rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
            Unable to load messages for this room.
          </div>
        )}

        {!isMessagesLoading && messages.length === 0 && (
          <div className='rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/50 px-4 py-6 text-center text-sm text-slate-400'>
            No messages yet. Start the conversation below.
          </div>
        )}

        <div ref={loadMoreSentinelRef} className='h-px w-full shrink-0' />

        {isFetchingNextPage && (
          <div className='rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-2 text-center text-xs text-slate-400'>
            Loading older messages...
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            renderContent={(text) => renderMessageContent(text, setPendingLink)}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        roomId={joinedRoomId || ''}
        disabled={!joinedRoomId}
        autoFocusEnabled={
          !pendingLink && !isEditModalOpen && !isDeleteModalOpen
        }
      />
      {linkDialog}
      {deleteDialog}
      <EditRoomModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        room={room}
      />
    </section>
  );
}
