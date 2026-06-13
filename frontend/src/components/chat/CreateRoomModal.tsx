import { socket } from '@/api/socket';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  IconBuildingBroadcastTower,
  IconCircleCheck,
  IconLock,
  IconSchool,
  IconX,
} from '@tabler/icons-react';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

const CreateRoomSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string('Room name is required'),
      v.trim(),
      v.minLength(1, 'Room name is required'),
      v.maxLength(100, 'Room name must be 100 characters or less'),
    ),
    type: v.picklist(['course', 'topic']),
    typeName: v.pipe(
      v.string('Type name is required'),
      v.trim(),
      v.minLength(1, 'Type name is required'),
      v.maxLength(100, 'Type name must be 100 characters or less'),
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

type TCreateRoomFormData = v.InferOutput<typeof CreateRoomSchema>;

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRoomModal({
  open,
  onOpenChange,
}: CreateRoomModalProps) {
  const queryClient = useQueryClient();
  const setJoinedRoomId = useRoomsStore((state) => state.setJoinedRoomId);
  const setSelectedRoomId = useRoomsStore((state) => state.setSelectedRoomId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<
    'public' | 'private'
  >('public');
  const [selectedType, setSelectedType] = useState<'course' | 'topic'>(
    'course',
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCreateRoomFormData>({
    resolver: valibotResolver(CreateRoomSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      type: 'course',
      typeName: '',
      visibility: 'public',
      memberLimit: 10,
    },
  });

  const closeModal = () => {
    setSubmitError(null);
    setSelectedVisibility('public');
    setSelectedType('course');
    reset({
      name: '',
      type: 'course',
      typeName: '',
      visibility: 'public',
      memberLimit: 10,
    });
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submitRoom = async (data: TCreateRoomFormData) => {
    setSubmitError(null);

    await new Promise<void>((resolve) => {
      socket.emit(
        'createRoom',
        data.name,
        data.type,
        data.typeName,
        data.visibility,
        data.memberLimit,
        ({ success, error, data: room }) => {
          if (success) {
            if (room?._id) {
              setJoinedRoomId(room._id);
              setSelectedRoomId(room._id);
            }

            closeModal();
            queryClient.invalidateQueries({
              ...queryOptions({ queryKey: ['rooms'] }),
            });
          } else {
            setSubmitError(error ?? 'Unable to create room');
          }

          resolve();
        },
      );
    });
  };

  if (!open) return null;

  const modal = (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-0 backdrop-blur-sm sm:items-center sm:px-4'>
      <button
        type='button'
        aria-label='Close create room dialog'
        className='absolute inset-0 cursor-default'
        onClick={closeModal}
      />

      <div className='relative z-10 w-full rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 sm:max-w-2xl sm:rounded-3xl sm:p-6'>
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div className='space-y-2'>
            <p className='text-xs uppercase tracking-[0.28em] text-emerald-300/70'>
              New room
            </p>
            <h3 className='chat-display-font text-2xl font-semibold text-slate-50'>
              Create a study space
            </h3>
            <p className='max-w-xl text-sm leading-6 text-slate-400'>
              Set the attributes of the room here, which will be visible to
              other students when they browse rooms. You can edit these later if
              you want.
            </p>
          </div>

          <button
            type='button'
            onClick={closeModal}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-slate-100'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit(submitRoom)}>
          <label className='block space-y-2'>
            <span className='text-sm font-medium text-slate-200'>
              Room name
            </span>
            <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
              <input
                {...register('name')}
                placeholder='e.g. Calculus Revision Hub'
                className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                autoComplete='off'
              />
            </div>
            {errors.name?.message && (
              <p className='text-sm text-rose-400'>{errors.name.message}</p>
            )}
          </label>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <span className='text-sm font-medium text-slate-200'>
                Room type
              </span>
              <div className='grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-2'>
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl p-1.5 text-sm font-semibold transition ${
                    selectedType === 'course'
                      ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <input
                    {...register('type', {
                      onChange: (event) =>
                        setSelectedType(
                          event.target.value as 'course' | 'topic',
                        ),
                    })}
                    type='radio'
                    value='course'
                    className='sr-only'
                  />
                  <IconSchool className='h-4 w-4' />
                  Course
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl p-1.5 text-sm font-semibold transition ${
                    selectedType === 'topic'
                      ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/30'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <input
                    {...register('type', {
                      onChange: (event) =>
                        setSelectedType(
                          event.target.value as 'course' | 'topic',
                        ),
                    })}
                    type='radio'
                    value='topic'
                    className='sr-only'
                  />
                  <IconCircleCheck className='h-4 w-4' />
                  Topic
                </label>
              </div>
              <p className='text-xs leading-5 text-slate-500'>
                Choose whether the room is tied to a course or a discussion
                topic.
              </p>
            </div>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-slate-200'>
                {selectedType === 'course' ? 'Course name' : 'Topic name'}
              </span>
              <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
                <input
                  {...register('typeName')}
                  placeholder={
                    selectedType === 'course'
                      ? 'e.g. Computer Science'
                      : 'e.g. Exam Revision'
                  }
                  className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                  autoComplete='off'
                />
              </div>
              {errors.typeName?.message ? (
                <p className='text-sm text-rose-400'>
                  {errors.typeName.message}
                </p>
              ) : (
                <p className='text-xs leading-5 text-slate-500'>
                  {selectedType === 'course'
                    ? 'Use the official course name or a shorthand title.'
                    : 'Use a short label that describes the discussion topic.'}
                </p>
              )}
            </label>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <span className='text-sm font-medium text-slate-200'>
                Visibility
              </span>
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
                        setSelectedVisibility(
                          event.target.value as 'public' | 'private',
                        ),
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
                        setSelectedVisibility(
                          event.target.value as 'public' | 'private',
                        ),
                    })}
                    type='radio'
                    value='private'
                    className='sr-only'
                  />
                  <IconLock className='h-4 w-4' />
                  Private
                </label>
              </div>
              <p className='text-xs leading-5 text-slate-500'>
                Public rooms can be discovered more easily, while private rooms
                keep the room code more controlled.
              </p>
            </div>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-slate-200'>
                Member limit
              </span>
              <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
                <input
                  {...register('memberLimit', { valueAsNumber: true })}
                  type='number'
                  min={2}
                  max={10}
                  step={1}
                  className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                />
              </div>
              {errors.memberLimit?.message ? (
                <p className='text-sm text-rose-400'>
                  {errors.memberLimit.message}
                </p>
              ) : (
                <p className='text-xs leading-5 text-slate-500'>
                  Pick a limit between 2 and 10 students.
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
              className='inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800/80'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {isSubmitting ? 'Creating room...' : 'Create room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
