import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-primary text-dark-900 hover:bg-primary-400 shadow-md hover:shadow-lg',
    secondary: 'bg-dark-900 text-white hover:bg-dark-800 shadow-md hover:shadow-lg',
    outline: 'border-2 border-dark-900 text-dark-900 hover:bg-dark-900 hover:text-white',
    ghost: 'text-dark-900 hover:bg-dark-100',
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
