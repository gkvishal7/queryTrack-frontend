"use client"

import type React from "react"

import { cn } from "../lib/utils"
import { type ReactNode, forwardRef } from "react"

interface ModularInputProps {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  className?: string
  required?: boolean
  disabled?: boolean
}

export const ModularInput = forwardRef<HTMLInputElement, ModularInputProps>(
  ({ label, placeholder, type = "text", value, onChange, error, icon, className, required, disabled }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-teal-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">{icon}</div>}
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "text-slate-900 dark:text-slate-100",
              "transition-all duration-200",
              icon && "pl-10",
              error && "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">{error}</p>
        )}
      </div>
    )
  },
)

ModularInput.displayName = "ModularInput"
