import Badge from '@/components/Badge';
import CustomInput from '@/components/CustomInput';
import InfoCard from '@/components/InfoCard';
import {
  IconMail,
  IconKey,
  IconArrowNarrowRight,
  IconUser,
  IconHash,
} from '@tabler/icons-react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useSignupMutation } from '@/api/hooks/auth/useSignupMutation';
import axios from 'axios';

const SignupSchema = v.pipe(
  v.object({
    fullName: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'Full name is required'),
    ),
    username: v.pipe(
      v.string('Username is required'),
      v.trim(),
      v.minLength(1, 'Username cannot be empty'),
    ),
    email: v.pipe(
      v.string('Email is required'),
      v.email('Invalid email address'),
    ),
    password: v.pipe(
      v.string('Password is required'),
      v.minLength(8, 'Password must be at least 8 characters'),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'Confirm password is required'),
    ),
  }),
  v.forward(
    v.check(
      ({ password, confirmPassword }) => password === confirmPassword,
      'Passwords do not match',
    ),
    ['confirmPassword'],
  ),
);
type TSignupFormData = v.InferOutput<typeof SignupSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupFormData>({
    resolver: valibotResolver(SignupSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { mutateAsync, isPending, isError, error } = useSignupMutation({});

  const onSubmit = async (data: TSignupFormData) => {
    await mutateAsync({ payload: data });
  };

  return (
    <main className='min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center'>
      <section className='w-full max-w-6xl px-8 min-h-screen grid items-center md:grid-cols-2 gap-12 border-l border-r border-slate-200/70 dark:border-slate-700/70'>
        <div className='flex flex-col justify-center gap-8 text-center md:text-left py-12 md:py-20'>
          <div className='flex flex-col gap-4 items-center md:items-start'>
            <Badge>Join thousands of students</Badge>
            <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight'>
              Start collaborating with your study circle today.
            </h1>
            <p className='max-w-xl text-slate-600 dark:text-slate-300'>
              Create your free EduZone account and connect with classmates,
              share resources, and stay on top of your coursework.
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-3 text-left'>
            <InfoCard
              title='Instant groups'
              description='Create or join study groups in seconds.'
            />
            <InfoCard
              title='No sign-up fee'
              description='Completely free for students.'
            />
            <InfoCard
              title='Always secure'
              description='Your data stays private and encrypted.'
            />
          </div>
        </div>

        <div className='flex items-center justify-center pb-12 md:py-8'>
          <div className='w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 p-8 shadow-2xl shadow-slate-200/60 dark:shadow-black/30 backdrop-blur'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold'>Create account</h2>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>
                Set up your EduZone profile in minutes.
              </p>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                icon={<IconUser className='h-6 w-6 text-slate-400' />}
                label='Full name'
                placeholder='Jane Doe'
                type='text'
                autoComplete='name'
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <CustomInput
                icon={<IconHash className='h-6 w-6 text-slate-400' />}
                label='Username'
                placeholder='coolguy_123'
                type='text'
                autoComplete='username'
                error={errors.username?.message}
                {...register('username')}
              />
              <CustomInput
                icon={<IconMail className='h-6 w-6 text-slate-400' />}
                label='Email'
                placeholder='you@example.com'
                type='email'
                autoComplete='email'
                error={errors.email?.message}
                {...register('email')}
              />
              <CustomInput
                icon={<IconKey className='h-6 w-6 text-slate-400' />}
                label='Password'
                placeholder='At least 8 characters'
                type='password'
                autoComplete='new-password'
                error={errors.password?.message}
                {...register('password')}
              />
              <CustomInput
                icon={<IconKey className='h-6 w-6 text-slate-400' />}
                label='Confirm password'
                placeholder='Confirm your password'
                type='password'
                autoComplete='new-password'
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <button
                type='submit'
                className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-white transition hover:bg-teal-600'
              >
                {isPending ? 'Please wait...' : 'Create account'}
                <IconArrowNarrowRight className='h-6 w-6' />
              </button>
              {isError && (
                <p className='text-center text-sm text-red-500 dark:text-red-400'>
                  {axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : 'An error occurred'}
                </p>
              )}
            </form>

            <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-300'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='font-semibold text-teal-600 dark:text-teal-300 hover:underline'
                replace
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
