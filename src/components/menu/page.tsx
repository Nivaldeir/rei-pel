import { cn } from '@/lib/utils'
import { GenericPropsDefault } from '../../../global'

export function DashboardPage({ children, className }: GenericPropsDefault) {
  return <section className={cn(['h-screen', className])}>{children}</section>
}

export function DashboardHeader({ children, className }: GenericPropsDefault) {
  return (
    <header
      className={cn([
        'px-6 py-3 space-y-6  border-b border-border flex  items-center justify-between',
        className,
      ])}
    >
      {children}
    </header>
  )
}
export function DashboardHeaderTilte({
  children,
  className,
}: GenericPropsDefault) {
  return (
    <span className={cn(['text-md uppercase', className])}>{children}</span>
  )
}
export function DashboardHeaderNav({
  children,
  className,
}: GenericPropsDefault) {
  return <nav className={cn([className])}>{children}</nav>
}
export function DashboardMain({ children, className }: GenericPropsDefault) {
  return <main className={cn('p-6', [className])}>{children}</main>
}
