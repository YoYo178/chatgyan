import ChatNavbar from '@/components/chat/ChatNavbar';
import ChatWindow from '@/components/chat/ChatWindow';
import ParticipantsPanel from '@/components/chat/ParticipantsPanel';
import RoomList from '@/components/chat/RoomList';
import { useSocketConnection } from '@/hooks/socket/useSocketConnection';

export default function ChatPage() {
  useSocketConnection();

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 lg:h-screen lg:overflow-hidden'>
      <div className='relative isolate min-h-screen overflow-hidden lg:h-full'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.12),_transparent_40%)]'
        />

        <div className='relative mx-auto flex min-h-screen w-full flex-col px-4 py-6 sm:px-6 lg:h-full lg:min-h-0 lg:px-8'>
          <ChatNavbar />

          <section className='mt-6 grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)_285px]'>
            <RoomList />
            <ChatWindow />
            <ParticipantsPanel />
          </section>
        </div>
      </div>
    </main>
  );
}
