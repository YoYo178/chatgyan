import { socket } from '@/api/socket';
import type { IRoom } from '@/types/room.types';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  IconBuildingBroadcastTower,
  IconHash,
  IconLock,
  IconPencil,
  IconX,
} from '@tabler/icons-react';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

const EditRoomSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string('Room name is required'),
      v.trim(),
      v.minLength(1, 'Room name is required'),
      v.maxLength(100, 'Room name must be 100 characters or less'),
    ),
    visibility: v.picklist(['public', 'private']),
    memberLimit: v.pipe(
      v.number('Member limit is required'),
      v.integer('Member limit must be a whole number'),
      v.minValue(2, 'Member limit must be at least 2'),
      v.maxValue(10, 'Member limit must be at most 10'),
    ),
  }),
);

type TEditRoomFormData = v.InferOutput<typeof EditRoomSchema>;

interface EditRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: IRoom | null;
}

export default function EditRoomModal({ open, onOpenChange, room }: EditRoomModalProps) {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<'public' | 'private'>('public');

  const memberLimitMin = useMemo(() => Math.max(2, room?.memberCount ?? 2), [room?.memberCount]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TEditRoomFormData>({
    resolver: valibotResolver(EditRoomSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      visibility: 'public',
      memberLimit: 10,
    },
  });

  const closeModal = useCallback(() => {
    setSubmitError(null);
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || !room) return;

    reset({
      name: room.name,
      visibility: room.visibility,
      memberLimit: room.memberLimit,
    });
    setSelectedVisibility(room.visibility);
    setSubmitError(null);
  }, [open, reset, room]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, open, closeModal]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submitRoom = async (data: TEditRoomFormData) => {
    if (!room) return;

    if (data.memberLimit < room.memberCount) {
      setSubmitError(
        `Member limit cannot be lower than the current member count (${room.memberCount}).`,
      );
      return;
    }

    setSubmitError(null);

    await new Promise<void>((resolve) => {
      socket.emit(
        'updateRoom',
        room._id,
        data.name,
        data.visibility,
        data.memberLimit,
        ({ success, error }) => {
          if (success) {
            closeModal();
            queryClient.invalidateQueries({
              ...queryOptions({ queryKey: ['rooms'] }),
            });
          } else {
            setSubmitError(error ?? 'Unable to update room');
          }

          resolve();
        },
      );
    });
  };

  if (!open || !room) return null;

  const roomTypeLabel = room.type === 'course' ? 'Course room' : 'Topic room';

  const modal = (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-0 backdrop-blur-sm sm:items-center sm:px-4'>
      <button
        type='button'
        aria-label='Close edit room dialog'
        className='absolute inset-0 cursor-default'
        onClick={closeModal}
      />

      <div className='relative z-10 w-full rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 sm:max-w-lg sm:rounded-3xl sm:p-6'>
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div className='space-y-2'>
            <p className='text-xs uppercase tracking-[0.28em] text-emerald-300/70'>Room settings</p>
            <h3 className='chat-display-font text-2xl font-semibold text-slate-50'>
              Edit study room
            </h3>
            <p className='text-sm leading-6 text-slate-400'>
              Update the room name, visibility, and member limit. Room type and code cannot be
              changed.
            </p>
          </div>

          <button
            type='button'
            onClick={closeModal}
            disabled={isSubmitting}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>

        <div className='mb-5 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 sm:grid-cols-2'>
          <div>
            <p className='text-xs uppercase tracking-[0.22em] text-slate-500'>Room type</p>
            <p className='mt-1 font-medium text-slate-100'>{roomTypeLabel}</p>
            <p className='mt-1 text-xs text-slate-400'>{room.typeName}</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-[0.22em] text-slate-500'>Room code</p>
            <p className='mt-1 inline-flex items-center gap-2 font-medium text-slate-100'>
              <IconHash className='h-4 w-4 text-emerald-300' />
              {room.code}
            </p>
          </div>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit(submitRoom)}>
          <label className='block space-y-2'>
            <span className='text-sm font-medium text-slate-200'>Room name</span>
            <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
              <input
                {...register('name')}
                placeholder='e.g. Calculus Revision Hub'
                className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                autoComplete='off'
              />
            </div>
            {errors.name?.message && <p className='text-sm text-rose-400'>{errors.name.message}</p>}
          </label>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <span className='text-sm font-medium text-slate-200'>Visibility</span>
              <div className='grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2'>
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl p-1.5 text-sm font-semibold transition ${
                    selectedVisibility === 'public'
                      ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <input
                    {...register('visibility', {
                      onChange: (event) =>
                        setSelectedVisibility(event.target.value as 'public' | 'private'),
                    })}
                    type='radio'
                    value='public'
                    className='sr-only'
                  />
                  <IconBuildingBroadcastTower className='h-4 w-4' />
                  Public
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl p-1.5 text-sm font-semibold transition ${
                    selectedVisibility === 'private'
                      ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <input
                    {...register('visibility', {
                      onChange: (event) =>
                        setSelectedVisibility(event.target.value as 'public' | 'private'),
                    })}
                    type='radio'
                    value='private'
                    className='sr-only'
                  />
                  <IconLock className='h-4 w-4' />
                  Private
                </label>
              </div>
              {errors.visibility?.message && (
                <p className='text-sm text-rose-400'>{errors.visibility.message}</p>
              )}
            </div>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-slate-200'>Member limit</span>
              <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
                <input
                  {...register('memberLimit', { valueAsNumber: true })}
                  type='number'
                  min={memberLimitMin}
                  max={10}
                  step={1}
                  className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                />
              </div>
              {errors.memberLimit?.message ? (
                <p className='text-sm text-rose-400'>{errors.memberLimit.message}</p>
              ) : (
                <p className='text-xs leading-5 text-slate-500'>
                  Must be between {memberLimitMin} and 10 (currently {room.memberCount} member
                  {room.memberCount === 1 ? '' : 's'}).
                </p>
              )}
            </label>
          </div>

          {submitError && (
            <p className='rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300'>
              {submitError}
            </p>
          )}

          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={closeModal}
              disabled={isSubmitting}
              className='inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60'
            >
              <IconPencil className='h-4 w-4' />
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
