import CustomModal from '@/components/globals/custom-modal'
import { useModal } from '@/components/providers/modal-provider'
import { Button } from '@/components/ui/button'
import { Prisma } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import View from './view'

export const columns: ColumnDef<
  Prisma.ProductSaleGetPayload<{
    include: {
      client: true
      product: true
    }
  }>
>[] = [
  {
    accessorKey: 'numeroPedido',
    header: ({ column }) => (
      <div className="flex max-w-[250px] justify-center ">
        <Button
          variant="ghost"
          className="flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cod. Pedido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <p className="h-[25px] max-w-[250px] truncate text-center">
          {row.original.codePedido}
        </p>
      )
    },
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <div className="flex w-full flex-1  justify-center">Cliente</div>
    ),
    cell: ({ row }) => {
      return (
        <p className="h-[25px] flex flex-1 truncate text-center ">
          {row.original.client.name}
        </p>
      )
    },
  },
  {
    accessorKey: 'client',
    header: ({ column }) => (
      <div className="flex w-full flex-1  justify-center">Valor total</div>
    ),
    cell: ({ row }) => {
      const price = row.original.product.reduce((acc, p) => {
        return acc + p.price
      }, 0)
      return (
        <p className="text-center">
          {price.toLocaleString('pt-BR', {
            currency: 'BRL',
            style: 'currency',
          })}
        </p>
      )
    },
  },
  {
    accessorKey: 'client',
    header: ({ column }) => (
      <div className="flex w-full flex-1  justify-center">
        Quantidades de item
      </div>
    ),
    cell: ({ row }) => {
      const quantity = row.original.product.reduce((acc, p) => {
        return acc + p.quantity
      }, 0)
      return <p className="text-center">{quantity}</p>
    },
  },
  {
    accessorKey: 'view',
    header: ({ column }) => <div className=""></div>,
    cell: ({ row }) => {
      const { setOpen } = useModal()
      return (
        <Button
          className="w-[250px]"
          onClick={() => {
            setOpen(
              <CustomModal>
                <View data={row.original} />
              </CustomModal>,
            )
          }}
        >
          Visualizar
        </Button>
      )
    },
  },
]
