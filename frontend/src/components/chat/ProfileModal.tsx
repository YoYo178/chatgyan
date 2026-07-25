import { useMe } from '@/api/hooks/users/useGetMeQuery';
import {
  useUpdateMeMutation,
  type TUpdateMeMutationBody,
} from '@/api/hooks/users/useUpdateMeMutation';
import { queryOptions, useQueryClient } from '@tanstack/react-query';
import { IconCalendar, IconSchool, IconUser, IconX } from '@tabler/icons-react';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

const ProfileSchema = v.pipe(
  v.object({
    fullName: v.pipe(
      v.string('Full name is required'),
      v.trim(),
      v.minLength(1, 'Full name is required'),
      v.maxLength(120, 'Full name must be 120 characters or less'),
    ),
    course: v.pipe(v.string(), v.trim()),
    year: v.pipe(v.string(), v.trim()),
  }),
);

type TProfileFormData = v.InferOutput<typeof ProfileSchema>;

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const queryClient = useQueryClient();
  const me = useMe();
  const { mutateAsync } = useUpdateMeMutation({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TProfileFormData>({
    resolver: valibotResolver(ProfileSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      course: '',
      year: '',
    },
  });

  const closeModal = useCallback(() => {
    setSubmitError(null);
    reset({
      fullName: me?.fullName ?? '',
      course: me?.course ?? '',
      year: me?.year ?? '',
    });
    onOpenChange(false);
  }, [onOpenChange, reset, me]);

  useEffect(() => {
    if (!open) return;

    reset({
      fullName: me?.fullName ?? '',
      course: me?.course ?? '',
      year: me?.year ?? '',
    });
  }, [me, open, reset]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, me?.fullName, me?.course, me?.year, closeModal]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submitProfile = async (data: TProfileFormData) => {
    setSubmitError(null);

    const payload: TUpdateMeMutationBody = {
      fullName: data.fullName,
      course: data.course.trim() ? data.course : undefined,
      year: data.year.trim() ? data.year : undefined,
    };

    try {
      await mutateAsync({ payload });
      await queryClient.invalidateQueries({
        ...queryOptions({ queryKey: ['users', 'me'] }),
      });
      closeModal();
    } catch {
      setSubmitError('Unable to update profile');
    }
  };

  if (!open) return null;

  const modal = (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-0 backdrop-blur-sm sm:items-center sm:px-4'>
      <button
        type='button'
        aria-label='Close profile dialog'
        className='absolute inset-0 cursor-default'
        onClick={closeModal}
      />

      <div className='relative z-10 w-full rounded-t-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 ring-1 ring-white/5 sm:max-w-2xl sm:rounded-3xl sm:p-6'>
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div className='space-y-2'>
            <p className='text-xs uppercase tracking-[0.28em] text-emerald-300/70'>Profile</p>
            <h3 className='chat-display-font text-2xl font-semibold text-slate-50'>
              Edit your student profile
            </h3>
            <div>
              <p className='max-w-xl text-sm leading-6 text-slate-400'>
                Update your student profile here
              </p>
              <p className='max-w-xl text-sm leading-6 text-slate-400'>
                You can edit your full name, course and year of study.
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={closeModal}
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-slate-100'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit(submitProfile)}>
          <label className='block space-y-2'>
            <span className='text-sm font-medium text-slate-200'>Full name</span>
            <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
              <div className='flex items-center gap-3'>
                <IconUser className='h-4 w-4 text-slate-400' />
                <input
                  {...register('fullName')}
                  placeholder='e.g. Ariana Mensah'
                  className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                  autoComplete='name'
                />
              </div>
            </div>
            {errors.fullName?.message && (
              <p className='text-sm text-rose-400'>{errors.fullName.message}</p>
            )}
          </label>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='block space-y-2'>
              <span className='text-sm font-medium text-slate-200'>Course</span>
              <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
                <div className='flex items-center gap-3'>
                  <IconSchool className='h-4 w-4 text-slate-400' />
                  <input
                    {...register('course')}
                    placeholder='e.g. Computer Science'
                    className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                    autoComplete='organization-title'
                  />
                </div>
              </div>
            </label>

            <label className='block space-y-2'>
              <span className='text-sm font-medium text-slate-200'>Year</span>
              <div className='rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 transition focus-within:border-emerald-400/60'>
                <div className='flex items-center gap-3'>
                  <IconCalendar className='h-4 w-4 text-slate-400' />
                  <input
                    {...register('year')}
                    placeholder='e.g. 3rd year'
                    className='w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500'
                    autoComplete='off'
                  />
                </div>
              </div>
            </label>
          </div>

          {submitError && (
            <div className='rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
              {submitError}
            </div>
          )}

          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={closeModal}
              className='inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:text-slate-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/15 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
