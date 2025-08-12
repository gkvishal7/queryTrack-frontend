
export default function FullScreenLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col items-center space-y-4 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium text-gray-900 dark:text-white">{message}</span>
      </div>
    </div>
  )
} 