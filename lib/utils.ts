import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Truncate text
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Generate slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get initials
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// 🎯 NEW: Generate Product ID
export function generateProductId(): string {
  const prefix = 'PROD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// 🎯 NEW: Generate Order ID
export function generateOrderId(): string {
  const prefix = 'ORD'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// 🎯 NEW: Generate short ID (for products, orders, etc.)
export function generateShortId(prefix: string = 'ID', length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = prefix + '-'
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 🎯 NEW: Generate unique ID using timestamp
export function generateUniqueId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

// 🎯 NEW: Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 🎯 NEW: Validate phone number (Indian)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 🎯 NEW: Format phone number
export function formatPhone(phone: string): string {
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
  }
  return phone
}

// 🎯 NEW: Get status color (for orders)
export function getStatusColor(status: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Processing: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  }
  return colors[status] || colors.Pending
}

// 🎯 NEW: Get status icon
export function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    Pending: '⏳',
    Confirmed: '✓',
    Processing: '🔄',
    Shipped: '📦',
    Delivered: '✅',
    Cancelled: '❌',
  }
  return icons[status] || '📋'
}

// 🎯 NEW: Calculate discount percentage
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice <= 0) return 0
  const discount = ((originalPrice - salePrice) / originalPrice) * 100
  return Math.round(discount)
}

// 🎯 NEW: Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 🎯 NEW: Capitalize first letter
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// 🎯 NEW: Capitalize each word
export function capitalizeWords(text: string): string {
  if (!text) return ''
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

// 🎯 NEW: Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// 🎯 NEW: Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// 🎯 NEW: Generate random color
export function getRandomColor(): string {
  const colors = [
    '#c9a84c', // Gold
    '#1a1a2e', // Navy
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#3498db', // Blue
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c', // Teal
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 🎯 NEW: Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

// 🎯 NEW: Sort array by key
export function sortBy<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return ascending ? -1 : 1
    if (aVal > bVal) return ascending ? 1 : -1
    return 0
  })
}

// 🎯 NEW: Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 🎯 NEW: Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 🎯 NEW: Check if object is empty
export function isEmptyObject(obj: any): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

// 🎯 NEW: Convert to title case
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
// Add to utils.ts

// 🎯 Cloudinary URL helper
export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
}): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'daxoqf3zi';
  const transformations: string[] = [];
  
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options?.quality) {
    transformations.push(`q_${options.quality}`);
  }
  if (options?.format) {
    transformations.push(`f_${options.format}`);
  }
  
  const transformationStr = transformations.length > 0 
    ? `${transformations.join(',')}/` 
    : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationStr}${publicId}`;
}

// 🎯 Get optimized Cloudinary URL for product images
export function getOptimizedProductImage(imageUrl: string, size: 'thumb' | 'small' | 'medium' | 'large' = 'medium'): string {
  if (!imageUrl) return '/api/placeholder/400/400';
  
  // If it's already a Cloudinary URL, optimize it
  if (imageUrl.includes('cloudinary.com')) {
    const sizes = {
      thumb: 'w_100,h_100,c_fill,q_auto,f_auto',
      small: 'w_300,h_300,c_fill,q_auto,f_auto',
      medium: 'w_600,h_600,c_fill,q_auto,f_auto',
      large: 'w_1200,h_1200,c_fill,q_auto,f_auto',
    };
    
    // Insert transformation before the upload path
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/${sizes[size]}/${parts[1]}`;
    }
  }
  
  return imageUrl;
}