import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-0.5 transition-colors">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3.5 py-2.5
          border border-gray-300 rounded-lg
          shadow-sm
          text-gray-900 placeholder-gray-400
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500
          hover:border-gray-400
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  )
}