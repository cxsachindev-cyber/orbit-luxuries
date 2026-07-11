import React from "react"
import { cn } from "@/lib/utils"

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl", className)}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn("bg-gray-50 border-b border-gray-100", className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableProps) {
  return (
    <tbody className={cn("divide-y divide-gray-100", className)}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr className={cn("hover:bg-gray-50/50 transition-colors", className)}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className }: TableProps) {
  return (
    <th className={cn(
      "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
      className
    )}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }: TableProps) {
  return (
    <td className={cn("px-6 py-4 text-sm text-gray-900", className)}>
      {children}
    </td>
  )
}

// Legacy support for older code
export function Th({ children, className }: TableProps) {
  return (
    <th className={cn(
      "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 border-b border-gray-100",
      className
    )}>
      {children}
    </th>
  )
}

export function Td({ children, className }: TableProps) {
  return (
    <td className={cn("px-6 py-4 text-sm text-gray-900 border-b border-gray-100", className)}>
      {children}
    </td>
  )
}