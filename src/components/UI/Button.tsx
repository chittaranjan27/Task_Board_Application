import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "link"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  rounded?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  rounded = false,
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70
    disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-75
    ${fullWidth ? "w-full" : ""}
    ${rounded ? "rounded-full" : "rounded-lg"}
  `

  const variantClasses = {
    primary: `
      bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300
      shadow-sm hover:shadow-md
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      shadow-sm hover:shadow-md
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 focus:ring-gray-200
      hover:shadow-sm
    `,
    outline: `
      border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200
      shadow-sm hover:shadow-md
    `,
    link: `
      text-indigo-600 hover:text-indigo-800 underline-offset-4
      hover:underline focus:ring-indigo-200
    `,
  }

  const sizeClasses = {
    xs: "px-2.5 py-1 text-xs gap-1",
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2",
    xl: "px-6 py-3 text-base gap-2.5",
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        ${loading ? "cursor-wait" : ""}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center">
          <svg
            className={`animate-spin ${size === "xs" ? "h-3 w-3" : "h-4 w-4"} ${
              iconPosition === "right" ? "order-1 ml-2" : "mr-2"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {children}
        </span>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={`inline-flex ${size === "xs" ? "h-3 w-3" : "h-4 w-4"}`}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className={`inline-flex ${size === "xs" ? "h-3 w-3" : "h-4 w-4"}`}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  )
}