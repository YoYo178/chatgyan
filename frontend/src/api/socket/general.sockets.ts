import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import type { APIResponse } from '@/api/types';
import type { IRoom } from '@/types/room.types';
import type { ChatGyanSocket } from '@/types/socket.types';
import type { IUser } from '@/types/user.types';
import { queryOptions, type QueryClient } from '@tanstack/react-query';

export function handleSocketConnection(socket: ChatGyanSocket, queryClient?: QueryClient) {
  handleSocketDisconnection(socket);

  socket.on('roomCreated', (room) => {
    // Update rooms data
    const oldRoomsData: APIResponse<{ rooms: IRoom[] }> | undefined = queryClient?.getQueryData([
      'rooms',
    ]);
    const newRoomsData: APIResponse<{ rooms: IRoom[] }> = {
      success: true,
      data: {
        rooms: [...(oldRoomsData?.data?.rooms || []), room],
      },
    };
    queryClient?.setQueryData(['rooms'], newRoomsData);

    const oldMeData: APIResponse<{ user: IUser }> | undefined = queryClient?.getQueryData([
      'users',
      'me',
    ]);
    if (room.owner === oldMeData?.data?.user._id)
      queryClient?.invalidateQueries({
        ...queryOptions({ queryKey: ['users', 'me'] }),
      });
  });

  socket.on('roomDeleted', (roomId, _ownerId) => {
    // Get old rooms data
    const oldRooms = queryClient?.getQueryData<APIResponse<{ rooms: IRoom[] }>>(['rooms'])?.data
      ?.rooms;
    if (!oldRooms) return;

    // Update rooms data
    queryClient.setQueryData(['rooms'], (old: APIResponse<{ rooms: IRoom[] }>) =>
      old
        ? {
            success: true,
            data: { rooms: oldRooms.filter((r) => r._id !== roomId) },
          }
        : old,
    );

    // If we had this room selected, clear it
    const { selectedRoomId, joinedRoomId, setSelectedRoomId, setJoinedRoomId } =
      useRoomsStore.getState();

    if (selectedRoomId === roomId) setSelectedRoomId(null);
    if (joinedRoomId === roomId) setJoinedRoomId(null);
  });

  socket.on('roomUpdated', (_roomId) => {
    queryClient?.invalidateQueries({
      ...queryOptions({ queryKey: ['rooms'] }),
    });
  });
}

export function handleSocketDisconnection(socket: ChatGyanSocket) {
  // Remove all general socket events
  socket.off('roomCreated');
  socket.off('roomDeleted');
  socket.off('roomUpdated');

  // Also remove any room-specific events that might still be active
  socket.off('memberJoined');
  socket.off('memberLeft');
}
