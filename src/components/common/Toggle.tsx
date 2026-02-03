import { forwardRef, InputHTMLAttributes } from 'react'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className = '', label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <label
        htmlFor={toggleId}
        className={`
          flex items-center justify-between cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <div className="flex-1">
          {label && <span className="text-white font-medium">{label}</span>}
          {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
        </div>
        <div className="relative ml-4">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-11 h-6 rounded-full
              peer-focus:ring-2 peer-focus:ring-primary-500
              transition-colors duration-200
              ${checked ? 'bg-primary-500' : 'bg-navy-600'}
            `}
          />
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </div>
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'
