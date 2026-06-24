'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-[8px] border ${
    hasError ? 'border-red-500' : 'border-gray-200'
  } focus:outline-none focus:border-gray-900 transition-colors text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed`

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id || props.name
    return (
      <div>
        <label
          htmlFor={fieldId}
          className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={`${inputClass(!!error)} ${className || ''}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
FormField.displayName = 'FormField'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id || props.name
    return (
      <div>
        <label
          htmlFor={fieldId}
          className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          className={`${inputClass(!!error)} resize-none ${className || ''}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
FormTextarea.displayName = 'FormTextarea'
