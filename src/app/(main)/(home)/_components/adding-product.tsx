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
import { Combobox } from '@/components/globals/combo-box'

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
  const [productSelected, setProductSelected] = useState<Product>()
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Adicionando produto</DialogTitle>
          <DialogDescription></DialogDescription>
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
          <div className="max-w-[400px] w-full">
            <Combobox
              data={data}
              fnAdd={(e: Product) => setProductSelected(e)}
              propsKey="description"
            />
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
