import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CalculateDiscount {
  price: number
  discount: number
  quantity: number
}
export function CalculateDiscount(params: CalculateDiscount) {
  const { price, discount = 0.0, quantity = 1 } = params

  const totalWithoutDiscount = price * quantity
  const discountAmount = (totalWithoutDiscount * discount) / 100
  const totalWithDiscount = totalWithoutDiscount - discountAmount
  return totalWithDiscount
}
