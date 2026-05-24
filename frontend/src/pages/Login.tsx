import Badge from '@/components/Badge';
import CustomInput from '@/components/CustomInput';
import InfoCard from '@/components/InfoCard';
import { IconMail, IconKey, IconArrowNarrowRight } from '@tabler/icons-react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useLoginMutation } from '@/api/hooks/auth/useLoginMutation';
import axios from 'axios';

const LoginSchema = v.object({
  email: v.pipe(
    v.string('Email is required'),
    v.email('Invalid email address'),
  ),
  password: v.pipe(
    v.string('Password is required'),
    v.minLength(8, 'Password must be at least 8 characters'),
  ),
});
type TLoginFormData = v.InferOutput<typeof LoginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormData>({
    resolver: valibotResolver(LoginSchema),
  });

  const { mutateAsync, isPending, isError, error } = useLoginMutation({});

  const onSubmit = async (data: TLoginFormData) => {
    await mutateAsync({ payload: data });
  };

  return (
    <main className='min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center'>
      <section className='w-full max-w-6xl px-8 min-h-screen grid items-center md:grid-cols-2 gap-12 border-l border-r border-slate-200/70 dark:border-slate-700/70'>
        <div className='flex flex-col justify-center gap-8 text-center md:text-left py-12 md:py-20'>
          <div className='flex flex-col gap-4 items-center md:items-start'>
            <Badge>Welcome back to ChatGyan</Badge>
            <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight'>
              Sign in and jump back into your study circles.
            </h1>
            <p className='max-w-xl text-slate-600 dark:text-slate-300'>
              Continue collaborating with classmates, keep track of assignments,
              and pick up right where you left off.
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-3 text-left'>
            <InfoCard
              title='Study rooms'
              description='Rejoin live group sessions in seconds.'
            />
            <InfoCard
              title='Shared resources'
              description='Access notes, docs, and study guides.'
            />
            <InfoCard
              title='Fast messaging'
              description='Keep every class conversation in one place.'
            />
          </div>
        </div>

        <div className='flex items-center justify-center pb-12 md:py-20'>
          <div className='w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 p-8 shadow-2xl shadow-slate-200/60 dark:shadow-black/30 backdrop-blur'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold'>Sign in</h2>
              <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>
                Use your ChatGyan account to continue.
              </p>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
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
                placeholder='Enter your password'
                type='password'
                autoComplete='current-password'
                error={errors.password?.message}
                {...register('password')}
              />

              <div className='flex flex-col items-center gap-2'>
                <button
                  type='submit'
                  className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-white transition hover:bg-teal-600'
                >
                  {isPending ? 'Signing in...' : 'Sign in'}
                  <IconArrowNarrowRight className='h-6 w-6' />
                </button>
                {isError && (
                  <p className='text-sm text-red-600 dark:text-red-400 mt-2'>
                    {axios.isAxiosError(error)
                      ? error.response?.data?.message
                      : 'An error occurred. Please try again.'}
                  </p>
                )}
              </div>
            </form>

            <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-300'>
              New here?{' '}
              <Link
                to='/signup'
                className='font-semibold text-teal-600 dark:text-teal-300 hover:underline'
                replace
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
