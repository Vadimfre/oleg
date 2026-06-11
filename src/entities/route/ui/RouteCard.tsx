import { RouteResponse } from '@/shared/api/routes.api'
import { resolveMediaUrl } from '@/shared/lib/resolveMediaUrl'

interface RouteCardProps {
  route: RouteResponse
  onClick?: () => void
}

export function RouteCard({ route, onClick }: RouteCardProps) {
  const difficultyLabels = {
    easy: 'Легкий',
    medium: 'Средний',
    hard: 'Сложный',
  }

  const difficultyIcons = {
    easy: (
      <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8"/>
      </svg>
    ),
    medium: (
      <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8"/>
      </svg>
    ),
    hard: (
      <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8"/>
      </svg>
    ),
  }

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-[12px] overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
    >
      {route.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={resolveMediaUrl(route.imageUrl)}
            alt={route.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback если изображение не загрузилось
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          
          {/* Сложность */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-[8px]">
            {difficultyIcons[route.difficulty]}
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{difficultyLabels[route.difficulty]}</span>
          </div>
        </div>
      )}
      
      <div className="p-6 space-y-4">
        {/* Заголовок */}
        <div>
          <h3 className="text-[18px] font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors leading-tight uppercase tracking-tight">
            {route.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {route.description}
          </p>
        </div>

        {/* Характеристики */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-0.5">{route.distance}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">км</div>
          </div>
          <div className="text-center border-l border-r border-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-0.5">{route.duration}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">ч</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-0.5">{route.elevation}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">м</div>
          </div>
        </div>
      </div>
    </div>
  )
}
