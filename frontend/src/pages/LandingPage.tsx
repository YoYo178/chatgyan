import InfoCard from "@/components/InfoCard";

export default function LandingPage() {
    return (
        <>
            <main className='min-h-screen flex flex-col items-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'>
                <section id='hero' className='md:max-w-6xl px-8 h-screen flex justify-center text-center md:justify-between md:text-left items-center border-l border-r'>
                    <div className='md:max-w-[60%] flex flex-col gap-8'>
                        <div className='flex flex-col gap-2 items-center md:items-start'>
                            <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight'>ChatGyan — Connect. Collaborate. Graduate.</h1>
                            <p className='text-slate-600 dark:text-slate-300 max-w-xl'>A collaboration platform built for online students to solve communication friction, coordinate study sessions, share resources, and stay on track.</p>
                        </div>

                        <div className='flex gap-3 justify-center md:justify-start'>
                            <a href='#signup' className='inline-block bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-semibold'>Get started — it's free</a>
                            <a href='#features' className='inline-block border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-md'>See features</a>
                        </div>
                    </div>

                    <div className='w-80 h-48 rounded-xl bg-linear-to-br from-white to-teal-50 dark:from-slate-800 dark:to-slate-700 hidden md:flex items-center justify-center text-teal-700 dark:text-emerald-300 font-semibold shadow'>Group study in one place</div>
                </section>

                <section id='problem' className='md:max-w-6xl px-8 h-screen flex flex-col gap-4 justify-center items-center border-l border-r text-center text-lg text-slate-600 dark:text-slate-300'>
                    <h2 className='text-3xl font-semibold text-primary-foreground'>Why students need ChatGyan</h2>
                    <p>Online learning is flexible — but staying connected and coordinating with peers is hard. Missed messages, scattered resources, and timezone gaps create friction that slows progress. ChatGyan centralizes communication, organizes study work, and makes collaboration simple.</p>
                    <p>(And yes, it works for in-person students too!)</p>
                    <p>Built by students, for students. ❤️</p>
                </section>

                <section id='features' className='max-w-6xl px-8 border-l border-r flex flex-col gap-8'>
                    <h2 className='text-2xl font-semibold text-center'>Features</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <InfoCard
                            title='Real-time Group Chat'
                            description='Persistent study rooms, TODO, and TODO that keep conversations organized.'
                        />

                        <InfoCard
                            title='Shared Resource Library'
                            description='Easily upload, tag, and search lecture notes, slides, and study guides.'
                        />

                        <InfoCard
                            title='Scheduling & Timezones'
                            description='Find overlapping availability and create study sessions that work for everyone.'
                        />

                        <InfoCard
                            title='Study Rooms'
                            description='Temporary focused rooms for pair programming, peer review, or exam prep.'
                        />
                    </div>
                </section>

                <section id='cta' className='max-w-6xl w-full px-8 py-40 flex flex-wrap md:flex-nowrap justify-center gap-4 text-center border-l border-r'>
                    <div className='w-full md:w-1/2 md:flex-1 px-8 py-8 border-l border-r rounded-4xl'>
                        <h3 className='text-xl font-semibold'>Ready to collaborate smarter?</h3>
                        <p className='mt-2 text-slate-600 dark:text-slate-300'>Join fellow online students and reclaim your time.</p>
                        <a id='signup' href='/signup' className='mt-4 inline-block bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-md font-semibold'>Create an account</a>
                    </div>
                    <div className='w-full md:w-1/2 md:flex-1 px-8 py-8 border-l border-r rounded-4xl'>
                        <h3 className='text-xl font-semibold'>Already a collaborator?</h3>
                        <p className='mt-2 text-slate-600 dark:text-slate-300'>Log in to your existing account and start collaborating.</p>
                        <a id='login' href='/login' className='mt-4 inline-block bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-md font-semibold'>Log in</a>
                    </div>
                </section>
            </main>

            <footer className='flex justify-between items-center text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-t border-slate-100 dark:border-slate-700 py-8'>
                <div className='max-w-6xl px-4 mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4'>
                    <div>© {new Date().getFullYear()} ChatGyan — Built for students.</div>
                    <div className='flex gap-4'>
                        <a href='/privacy' className='hover:underline'>Privacy</a>
                        <a href='/terms' className='hover:underline'>Terms</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
