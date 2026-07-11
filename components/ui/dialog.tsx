"use client"

import React, { createContext, useContext, useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function Dialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  // Prevent background scrolling when premium modal window is active
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({
  children,
  asChild,
  onClick,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used inside a Dialog component")

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1a1a2e]/20 transition-all duration-300",
        className
      )}
      onClick={(e) => {
        context.onOpenChange(true)
        if (onClick) onClick(e)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used inside a Dialog component")

  if (!context.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Premium Dark Backdrop Glass Overlay */}
      <div
        className="absolute inset-0 bg-[#1a1a2e]/70 backdrop-blur-sm transition-opacity"
        onClick={() => context.onOpenChange(false)}
      />

      {/* Main Structural Modal Viewport */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg scale-100 rounded-2xl border border-gray-100/50 bg-white p-6 shadow-2xl transition-all duration-300 animate-scale-in text-left",
          className
        )}
      >
        {children}

        {/* Absolute Layout Close Button */}
        <button
          onClick={() => context.onOpenChange(false)}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close Dialog</span>
        </button>
      </div>
    </div>
  )
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}>
      {children}
    </div>
  )
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={cn(
      "text-xl font-bold text-gray-900 tracking-tight",
      className
    )}>
      {children}
    </h2>
  )
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn("text-sm text-gray-500 font-normal", className)}>
      {children}
    </p>
  )
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 border-t border-gray-100 pt-4 mt-6",
        className
      )}
    >
      {children}
    </div>
  )
}