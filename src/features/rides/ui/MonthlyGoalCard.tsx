'use client'

import { useState } from 'react'
import { formatDistance } from '@/shared/lib/map/geo-utils'
import { updateProfile } from '@/features/auth/model/auth.api'

interface MonthlyGoalCardProps {
  currentKm: number
  goalKm: number
  progress: number
  editable?: boolean
  onGoalUpdated?: (km: number) => void
}

export function MonthlyGoalCard({
  currentKm,
  goalKm,
  progress,
  editable,
  onGoalUpdated,
}: MonthlyGoalCardProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(goalKm))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const km = Number(value)
    if (km < 10 || km > 500) return
    setSaving(true)
    try {
      await updateProfile({ monthlyGoalKm: km })
      onGoalUpdated?.(km)
      setEditing(false)
    } catch {
      /* ignore */
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-[12px] border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Цель месяца
          </p>
          <p className="text-2xl font-black text-gray-900">
            {formatDistance(currentKm)}{' '}
            <span className="text-gray-400 font-semibold text-lg">
              / {goalKm} км
            </span>
          </p>
        </div>
        <div className="text-3xl font-black text-gray-900 tabular-nums">{progress}%</div>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {editable && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {editing ? (
            <div className="flex gap-2">
              <input
                type="number"
                min={10}
                max={500}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg"
              >
                OK
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Изменить цель →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
