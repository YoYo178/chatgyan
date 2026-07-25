import { startListeningMessageEvents, stopListeningMessageEvents } from './message.sockets';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import type { ChatGyanSocket } from '@/types/socket.types';

export function startListeningRoomEvents(socket: ChatGyanSocket, queryClient?: QueryClient) {
  stopListeningRoomEvents(socket);

  socket.on('memberJoined', (roomId, userId) => {
    console.log(`A new member joined the room (${roomId}):`, userId);
    // Invalidate room data to refresh member list
    queryClient?.invalidateQueries({
      ...queryOptions({ queryKey: ['rooms'] }),
    });
  });

  socket.on('memberLeft', (roomId, userId) => {
    console.log(`A member left the room (${roomId}):`, userId);
    // Invalidate room data to refresh member list
    queryClient?.invalidateQueries({
      ...queryOptions({ queryKey: ['rooms'] }),
    });
  });

  startListeningMessageEvents(socket, queryClient);
}

export function stopListeningRoomEvents(socket: ChatGyanSocket) {
  socket.off('memberJoined');
  socket.off('memberLeft');

  stopListeningMessageEvents(socket);
}
