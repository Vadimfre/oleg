import { RouteResponse } from '@/shared/api/routes.api'

interface RouteCardProps {
  route: RouteResponse
  onClick?: () => void
}

const difficultyConfig = {
  easy: {
    label: 'Легкий',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400/30',
    badge: 'bg-emerald-500/90',
  },
  medium: {
    label: 'Средний',
    dot: 'bg-amber-400',
    ring: 'ring-amber-400/30',
    badge: 'bg-amber-500/90',
  },
  hard: {
    label: 'Сложный',
    dot: 'bg-rose-500',
    ring: 'ring-rose-400/30',
    badge: 'bg-rose-600/90',
  },
} as const

export function RouteCard({ route, onClick }: RouteCardProps) {
  const diff = difficultyConfig[route.difficulty]

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative bg-white rounded-2xl overflow-hidden border border-gray-100/80 card-hover ring-1 ring-transparent hover:ring-primary/40"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-300 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {route.imageUrl && (
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={route.imageUrl}
            alt={route.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/10 to-transparent" />

          <div className={`absolute top-4 right-4 flex items-center gap-2 ${diff.badge} backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg`}>
            <span className={`w-2 h-2 rounded-full ${diff.dot} ring-2 ${diff.ring}`} />
            {diff.label}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg">
              {route.title}
            </h3>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
        {!route.imageUrl && (
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
            {route.title}
          </h3>
        )}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 -mt-1">
          {route.description}
        </p>

        <div className="grid grid-cols-3 gap-2 pt-3">
          <MetricBox value={String(route.distance)} unit="км" />
          <MetricBox value={String(route.duration)} unit="ч" highlight />
          <MetricBox value={String(route.elevation)} unit="м" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
            Открыть маршрут
          </span>
          <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm group-hover:bg-primary group-hover:text-dark-900 transition-colors duration-300">
            →
          </span>
        </div>
      </div>
    </div>
  )
}

function MetricBox({
  value,
  unit,
  highlight,
}: {
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div
      className={`text-center rounded-xl py-3 ${
        highlight ? 'bg-primary/15 border border-primary/20' : 'bg-gray-50'
      }`}
    >
      <div className="text-xl font-black text-gray-900 tabular-nums leading-none">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{unit}</div>
    </div>
  )
}
