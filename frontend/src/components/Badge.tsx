export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex w-fit rounded-full border border-teal-200 dark:border-teal-900/70 bg-teal-50 dark:bg-teal-900/30 px-4 py-1 text-sm font-medium text-teal-700 dark:text-teal-300'>
      {children}
    </span>
  );
}
