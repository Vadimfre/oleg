import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className = '', onClick, hover = true }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-soft p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-medium hover:-translate-y-1' : ''
      } ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
