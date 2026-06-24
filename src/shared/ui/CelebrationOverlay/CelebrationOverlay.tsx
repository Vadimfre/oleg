'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#FFCC00', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function CelebrationOverlay({ active, onDone }: { active: boolean; onDone?: () => void }) {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; size: number }[]>([])

  useEffect(() => {
    if (!active) return

    setPieces(
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.8,
        size: 6 + Math.random() * 8,
      })),
    )

    const t = setTimeout(() => {
      setPieces([])
      onDone?.()
    }, 3200)

    return () => clearTimeout(t)
  }, [active, onDone])

  if (!active || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.left}%`,
            top: '-5%',
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            animation: `confetti-fall ${2 + Math.random()}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
