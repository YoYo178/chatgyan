import { Mail, LockKeyhole, User, ArrowRight } from 'lucide-react';

export default function Signup() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center">
            <section className="w-full max-w-6xl px-8 min-h-screen grid items-center md:grid-cols-2 gap-12 border-l border-r border-slate-200/70 dark:border-slate-700/70">
                <div className="flex flex-col justify-center gap-8 text-center md:text-left py-12 md:py-20">
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <span className="inline-flex w-fit rounded-full border border-teal-200 dark:border-teal-900/70 bg-teal-50 dark:bg-teal-900/30 px-4 py-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                            Join thousands of students
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                            Start collaborating with your study circle today.
                        </h1>
                        <p className="max-w-xl text-slate-600 dark:text-slate-300">
                            Create your free EduZone account and connect with classmates, share resources, and stay on top of your coursework.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 text-left">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                            <p className="text-sm font-semibold">Instant groups</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create or join study groups in seconds.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                            <p className="text-sm font-semibold">No sign-up fee</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Completely free for students.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                            <p className="text-sm font-semibold">Always secure</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your data stays private and encrypted.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center pb-12 md:py-8">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 p-8 shadow-2xl shadow-slate-200/60 dark:shadow-black/30 backdrop-blur">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">Create account</h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Set up your EduZone profile in minutes.
                            </p>
                        </div>

                        <form className="space-y-5">
                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Full name</span>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/40">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Jane Doe"
                                        className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </label>

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
                                        placeholder="At least 8 characters"
                                        className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Confirm password</span>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/40">
                                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Re-enter your password"
                                        className="w-full bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                                    />
                                </div>
                            </label>

                            <label className="inline-flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                <input type="checkbox" className="mt-1 rounded border-slate-300 text-teal-500 focus:ring-teal-500" />
                                I agree to the{' '}
                                <a href="/terms" className="font-semibold text-teal-600 dark:text-teal-300 hover:underline">
                                    Terms of Service
                                </a>
                                {' '}and{' '}
                                <a href="/privacy" className="font-semibold text-teal-600 dark:text-teal-300 hover:underline">
                                    Privacy Policy
                                </a>
                            </label>

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-white transition hover:bg-teal-600"
                            >
                                Create account
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                            Already have an account?{' '}
                            <a href="/login" className="font-semibold text-teal-600 dark:text-teal-300 hover:underline">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}
