import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';

export default function Login() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center">
            <section className="w-full max-w-6xl px-8 min-h-screen grid items-center md:grid-cols-2 gap-12 border-l border-r border-slate-200/70 dark:border-slate-700/70">
                <div className="flex flex-col justify-center gap-8 text-center md:text-left py-12 md:py-20">
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <span className="inline-flex w-fit rounded-full border border-teal-200 dark:border-teal-900/70 bg-teal-50 dark:bg-teal-900/30 px-4 py-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                            Welcome back to EduZone
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                            Sign in and jump back into your study circles.
                        </h1>
                        <p className="max-w-xl text-slate-600 dark:text-slate-300">
                            Continue collaborating with classmates, keep track of assignments, and pick up right where you left off.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 text-left">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                            <p className="text-sm font-semibold">Study rooms</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Rejoin live group sessions in seconds.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                            <p className="text-sm font-semibold">Shared resources</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Access notes, docs, and study guides.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                            <p className="text-sm font-semibold">Fast messaging</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Keep every class conversation in one place.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center pb-12 md:py-20">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 p-8 shadow-2xl shadow-slate-200/60 dark:shadow-black/30 backdrop-blur">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">Sign in</h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Use your EduZone account to continue.
                            </p>
                        </div>

                        <form className="space-y-5">
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/40">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/40">
                                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </label>

                            <div className="flex items-center justify-between gap-3 text-sm">
                                <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <input type="checkbox" className="rounded border-slate-300 text-teal-500 focus:ring-teal-500" />
                                    Remember me
                                </label>
                            </div>


                            <div className='flex flex-col items-center gap-2'>
                                <a href="/forgot-password" className="font-medium text-teal-600 dark:text-teal-300 hover:underline">
                                    Forgot password?
                                </a>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-white transition hover:bg-teal-600"
                                >
                                    Sign in
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                            New here?{' '}
                            <a href="/signup" className="font-semibold text-teal-600 dark:text-teal-300 hover:underline">
                                Create an account
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
