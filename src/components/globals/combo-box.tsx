'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Props = {
  data: { [key: string]: any }[]
  propsKey: string
  fnAdd: (params: any) => any
}
export function Combobox({ data, propsKey, fnAdd }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data?.find((framework) => framework[propsKey] === value)?.[
                propsKey
              ]
            : 'Selecione...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Selecione..." className="h-9 w-full" />
          <CommandList>
            <CommandEmpty>Não encontrado.</CommandEmpty>
            <CommandGroup>
              {data.map((framework) => (
                <CommandItem
                  key={framework.id + '-' + Date.now()}
                  value={framework[propsKey]}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    fnAdd(framework)
                    setOpen(false)
                  }}
                >
                  {framework[propsKey]}
                  <CheckIcon
                    className={cn(
                      'h-4 w-4',
                      value === framework[propsKey]
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
