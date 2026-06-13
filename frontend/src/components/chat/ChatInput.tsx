import { socket } from '@/api/socket';
import { IconSend } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react';

interface ChatInputProps {
  roomId: string;
  disabled?: boolean;
  autoFocusEnabled?: boolean;
}

export default function ChatInput({
  roomId,
  disabled = false,
  autoFocusEnabled = true,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedMessage = message.trim();
  const isSubmitDisabled = disabled || !trimmedMessage;

  const focusInput = useCallback(() => {
    if (disabled || !autoFocusEnabled || !roomId) return;

    // Defer until after React commits DOM updates (e.g. after clearing the field).
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  }, [autoFocusEnabled, disabled, roomId]);

  useEffect(() => {
    if (disabled || !roomId) return;

    focusInput();
  }, [disabled, focusInput, roomId]);

  useEffect(() => {
    if (!autoFocusEnabled || disabled || !roomId) return;

    focusInput();
  }, [autoFocusEnabled, disabled, focusInput, roomId]);

  useEffect(() => {
    const handleWindowFocus = () => focusInput();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        focusInput();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [focusInput]);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    const content = trimmedMessage;
    setMessage('');
    setError(null);
    focusInput();

    socket.emit('sendMessage', roomId, content, ({ success, error: ackError }) => {
      if (success) {
        focusInput();
        return;
      }

      setError(ackError ?? 'Unable to send your message.');
      setMessage((current) => current || content);
      focusInput();
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/50 px-4 py-3'
    >
      <div className='flex flex-wrap items-center gap-3'>
        <label className='flex flex-1 items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 focus-within:border-emerald-400/60'>
          <input
            ref={inputRef}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (error) setError(null);
            }}
            disabled={disabled}
            placeholder='Share an update, ask a question, or drop a resource link...'
            className='w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none disabled:cursor-not-allowed disabled:opacity-60'
          />
        </label>
        <button
          type='submit'
          disabled={isSubmitDisabled}
          className='inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-60'
        >
          Send
          <IconSend className='h-4 w-4' />
        </button>
      </div>

      {error && <p className='text-xs text-rose-300'>{error}</p>}
    </form>
  );
}
