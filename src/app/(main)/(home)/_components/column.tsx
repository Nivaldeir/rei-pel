'use client'
import { ProductWithDetails } from '@/@types/products'
import { CalculateDiscount } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { X } from 'lucide-react'

type props = {
  onDelete: (product: ProductWithDetails) => void
}
export function column({ onDelete }: props): ColumnDef<ProductWithDetails>[] {
  return [
    {
      accessorKey: 'code',
      header: () => <div className="text-center">Codigo</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row.original?.code}</div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.original?.description}
          </div>
        )
      },
    },
    {
      accessorKey: 'apress',
      header: () => <div className="text-center">Apress</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row.original?.apres}</div>
        )
      },
    },
    {
      accessorKey: 'price',
      header: () => <div className="text-center">Preço</div>,
      cell: ({ row }) => {
        const { table } = row.original
        return (
          <div className="text-center font-medium">
            {row.original[table]?.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'discount',
      header: () => <div className="text-center">Desconto</div>,
      cell: ({ row }) => {
        if (!row.original.discount)
          return (
            <div className="text-center font-medium">
              {parseFloat('0').toLocaleString('pt-BR', {
                style: 'percent',
              })}
            </div>
          )

        const discount = row.original.discount / 100
        return (
          <div className="text-center font-medium">
            {discount.toLocaleString(undefined, {
              style: 'percent',
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'quantity',
      header: () => <div className="text-center">Quantidade</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">{row.original.quantity}</div>
        )
      },
    },
    {
      accessorKey: 'total',
      header: () => <div className="text-center">Total</div>,
      cell: ({ row }) => {
        const totalWithDiscount = CalculateDiscount({
          discount: row.original.discount,
          quantity: row.original.quantity,
          price: row.original[row.original.table],
        })
        return (
          <div className="text-center font-medium">
            R$ {totalWithDiscount.toFixed(2).replace('.', ',')}
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: () => <div className="text-start">Ações</div>,
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex justify-center">
            <X
              onClick={() => onDelete(product)}
              className="h-4 text-center cursor-pointer"
            />
          </div>
        )
      },
    },
  ]
}
