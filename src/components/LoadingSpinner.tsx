export function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-zinc-200 dark:border-zinc-700"></div>
        <div className="absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-teal-500 dark:border-t-teal-400"></div>
      </div>
    </div>
  )
}
