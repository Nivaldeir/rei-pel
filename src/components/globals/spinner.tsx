import { cn } from '@/lib/utils'

export function Spinner({ className }: Omit<GenericPropsDefault, 'children'>) {
  return (
    <div
      className={cn([
        'inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white',
        className,
      ])}
      role="status"
    />
  )
}
