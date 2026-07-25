export default function LoadingPage() {
  return (
    <main className='min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100'>
      <div className='relative isolate min-h-screen overflow-hidden'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_transparent_55%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.1),_transparent_40%)]'
        />

        <div className='relative mx-auto flex min-h-screen w-full flex-col items-center justify-center px-6'>
          <div className='flex flex-col items-center gap-6 text-center'>
            <div className='flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:shadow-black/40'>
              <span className='chat-display-font tracking-[0.24em] text-emerald-500/80'>
                CHATGYAN
              </span>
              <span className='text-xs uppercase tracking-[0.28em] text-slate-400'>Preparing</span>
            </div>

            <div className='flex items-center gap-3'>
              <span className='h-3 w-3 animate-pulse rounded-full bg-emerald-400/70' />
              <span className='h-3 w-3 animate-pulse rounded-full bg-sky-400/70 [animation-delay:150ms]' />
              <span className='h-3 w-3 animate-pulse rounded-full bg-slate-400/70 [animation-delay:300ms]' />
            </div>

            <p className='max-w-md text-base text-slate-600 dark:text-slate-300'>
              Setting up your study space and syncing the latest updates.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
