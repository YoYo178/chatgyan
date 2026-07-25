import type { IMessage } from '@/types/message.types';
import type { ChatGyanSocket } from '@/types/socket.types';
import type { QueryClient } from '@tanstack/react-query';

export function startListeningMessageEvents(socket: ChatGyanSocket, queryClient?: QueryClient) {
  stopListeningMessageEvents(socket);

  socket.on('newMessage', (roomId, userId, message) => {
    console.log(`Received new message from ${userId}: ${message.content}`);

    const oldMessagePages = queryClient?.getQueryData<{
      pages: { success: true; data: { messages: IMessage[]; nextCursor: string | null } }[];
      pageParams: string[];
    }>(['messages', roomId]);
    if (!oldMessagePages) return;

    const newMessagePages = structuredClone(oldMessagePages);
    newMessagePages.pages[0].data.messages.push(message);

    queryClient?.setQueryData(['messages', roomId], newMessagePages);
  });
}

export function stopListeningMessageEvents(socket: ChatGyanSocket) {
  socket.off('newMessage');
}
