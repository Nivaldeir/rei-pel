import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Product } from '@prisma/client'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  quantity: z.preprocess((value) => Number(value), z.number().min(1)),
  discount: z.preprocess((value) => Number(value), z.number().min(0).max(100)),
  table: z.string(),
})

type Props = {
  data: Product[]
  fnAdd: (params: Product & z.infer<typeof schema>) => void
  table: string
}

export const AddingProduct = ({ data, fnAdd, table }: Props) => {
  const [productsFilter, setProductsFilter] = useState<Product[]>(data)
  const [productSelected, setProductSelected] = useState<Product | null>(null)
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState<z.infer<typeof schema>>({
    discount: 0,
    quantity: 1,
    table,
  })

  const handleSubmit = () => {
    try {
      if (!productSelected) throw new Error('Product not selected')
      if (schema.parse(details)) {
        fnAdd({ ...productSelected, ...details })
        toast({
          title: 'Produto',
          description: 'Produto adicionado',
          variant: 'default',
        })
        setProductSelected(null)
        setDetails((prev) => {
          return { ...prev, discount: 0, quantity: 1 }
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'default'}
          onClick={() => ''}
          className="bg-green-400 hover:bg-green-500 max-sm:w-full max-sm:mt-4"
        >
          Adicionar produtos
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:w-[500px] max-sm:w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Adicionando produto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <p className="text-sm">Quantidade</p>
              <Input
                type="number"
                value={details.quantity}
                placeholder="Quantidade"
                name="quantity"
                onChange={(e) =>
                  setDetails((prev) => {
                    return { ...prev, [e.target.name]: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <p className="text-sm">Desconto</p>
              <Input
                type="number"
                value={details.discount}
                placeholder="Desconto"
                name="discount"
                onChange={(e) =>
                  setDetails((prev) => {
                    return { ...prev, [e.target.name]: e.target.value }
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-2 justify-between">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between "
                >
                  {productSelected ?
                    data?.find((p) => p.code === productSelected.code)?.description :
                    'Selecione...'}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 ">
                <Command className='w-full h-full '>
                  <div className='p-1'>
                    <Input placeholder="Selecione..." className="h-9 " onChange={(params) => {
                      setProductsFilter(data.filter(p => p.code.toString().includes(params.target.value) || p.description.toString().includes(params.target.value)))
                    }} />
                  </div>
                  <CommandList>
                    <CommandEmpty>Não encontrado.</CommandEmpty>
                    <CommandGroup>
                      {productsFilter.map((product) => (
                        <CommandItem
                          className='w-full break-words'
                          key={product.code}
                          value={product.description}
                          onSelect={() => {
                            setProductSelected(product)
                            setOpen(false)
                          }}
                        >
                          {product.description}
                          <CheckIcon
                            className={cn(
                              'h-4 w-4',
                              productSelected?.description === product?.description
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
          </div>
          <div className="flex gap-4">
            <Input
              disabled
              value={productSelected?.code}
              placeholder="Codigo"
            />
            <Input
              disabled
              value={productSelected?.apres}
              placeholder="Apress"
            />
          </div>
          <div className="flex gap-4">
            <Input
              disabled
              value={productSelected?.table1?.toLocaleString('pt-br', {
                currency: 'BRL',
                style: 'currency',
              })}
              placeholder="Codigo"
            />
            <Input
              disabled
              value={productSelected?.table2?.toLocaleString('pt-br', {
                currency: 'BRL',
                style: 'currency',
              })}
              placeholder="Apress"
            />
            <Input
              disabled
              value={productSelected?.table3?.toLocaleString('pt-br', {
                currency: 'BRL',
                style: 'currency',
              })}
              placeholder="Apress"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!productSelected?.code}
          >
            <DialogPrimitive.Close className="w-full">
              Adicionar
            </DialogPrimitive.Close>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
