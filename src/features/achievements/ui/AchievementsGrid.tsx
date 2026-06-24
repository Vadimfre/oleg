'use client'

import type { Achievement } from '@/features/rides/model/rides.api'

interface AchievementsGridProps {
  achievements: Achievement[]
  compact?: boolean
}

export function AchievementsGrid({ achievements, compact }: AchievementsGridProps) {
  const unlocked = achievements.filter((a) => a.unlocked)

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {unlocked.slice(0, 6).map((a) => (
          <span
            key={a.id}
            title={a.title}
            className="text-xl bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center"
          >
            {a.icon}
          </span>
        ))}
        {unlocked.length === 0 && (
          <p className="text-xs text-gray-500">Пока нет достижений — начните поездку!</p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {achievements.map((a) => (
        <div
          key={a.id}
          className={`rounded-[12px] border p-4 transition-all ${
            a.unlocked
              ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
              : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
          }`}
        >
          <div className="text-3xl mb-2">{a.icon}</div>
          <p className="font-bold text-sm">{a.title}</p>
          <p className={`text-xs mt-1 ${a.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {a.description}
          </p>
        </div>
      ))}
    </div>
  )
}
