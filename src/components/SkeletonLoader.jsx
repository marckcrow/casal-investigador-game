/**
 * Skeleton loading states for cards and content
 */
export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`case-file p-4 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-800 rounded" />
          <div className="h-4 w-16 bg-gray-800 rounded" />
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-800 rounded"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function SkeletonCaseCard({ className = '' }) {
  return (
    <div className={`case-file rounded-lg overflow-hidden ${className}`}>
      <div className="h-1.5 bg-gray-800 animate-pulse" />
      <div className="p-4 animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-800 rounded" />
          <div className="h-4 w-12 bg-gray-800 rounded" />
        </div>
        <div className="h-5 w-full bg-gray-800 rounded" />
        <div className="h-3 w-3/4 bg-gray-800 rounded" />
        <div className="h-3 w-1/2 bg-gray-800 rounded" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-16 bg-gray-800 rounded" />
          <div className="h-5 w-16 bg-gray-800 rounded" />
        </div>
        <div className="h-8 w-full bg-gray-800 rounded mt-2" />
      </div>
    </div>
  )
}

export function SkeletonLine({ width = '100%', className = '' }) {
  return (
    <div
      className={`h-3 bg-gray-800 rounded animate-pulse ${className}`}
      style={{ width }}
    />
  )
}

export default function SkeletonLoader({ variant = 'card', count = 1, className = '' }) {
  if (variant === 'case-grid') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCaseCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
