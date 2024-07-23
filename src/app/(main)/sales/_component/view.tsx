'use client'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/data-picker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CalculateDiscount } from '@/lib/utils'
import { Prisma, ProductQuantity } from '@prisma/client'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  data: Prisma.ProductSaleGetPayload<{
    include: {
      client: true
      product: true
    }
  }>
}

export const columns: ColumnDef<ProductQuantity>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <div className="flex max-w-[250px] justify-center ">
        <Button
          variant="ghost"
          className="flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cod.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <p className="h-[25px] max-w-[250px] truncate text-center">
          {row.original.code}
        </p>
      )
    },
  },
  {
    accessorKey: 'discount',
    header: ({ column }) => (
      <div className="flex w-full flex-1  justify-center">Desconto</div>
    ),
    cell: ({ row }) => {
      return (
        <p className="h-[25px] flex flex-1 truncate text-center ">
          {row.original.description}
        </p>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <div className="flex w-full flex-1  justify-center">Valor total</div>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {row.original.price.toLocaleString('pt-BR', {
            currency: 'BRL',
            style: 'currency',
          })}
        </p>
      )
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <div className="flex w-full flex-1  justify-center">Total</div>
    ),
    cell: ({ row }) => {
      const total = CalculateDiscount({
        discount: row.original.discount,
        price: row.original.price,
        quantity: row.original.quantity,
      })
      return (
        <p className="text-center">
          {total.toLocaleString('pt-BR', {
            currency: 'BRL',
            style: 'currency',
          })}
        </p>
      )
    },
  },
]

export default function View({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: data.product,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  })

  return (
    <aside>
      <div className="flex gap-4 max-sm:flex-col" aria-disabled>
        <DatePicker date={data.createAt} onChange={() => ''} />
      </div>
      <div className="relative mt-4 rounded-md p-4 bg-white border-border border-[1px] flex flex-wrap gap-4 w-full flex-1 ">
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Cod. Pedido
          </span>
          <Input placeholder="Codigo" value={data.numeroPedido} disabled />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Classificação
          </span>
          <Input
            placeholder="Classificação"
            value={data.client.classification}
            disabled
          />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Identificação
          </span>
          <Input
            placeholder="Identificação"
            value={data.client.identification}
            disabled
          />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Nome
          </span>
          <Input placeholder="Nome" value={data.client.name} disabled />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Razao social
          </span>
          <Input
            placeholder="Razão social"
            value={data.client.razaoSocial}
            disabled
          />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Telefone
          </span>
          <Input placeholder="Telefone" value={data.client.tell} disabled />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Registro nacional
          </span>
          <Input
            placeholder="Registro nacional"
            value={data.client.stateRegistration}
            disabled
          />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Cidade
          </span>
          <Input placeholder="Cidade" value={data.client.state} disabled />
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Estado
          </span>
          <Input placeholder="Estado" value={data.client.city} disabled />
        </div>
      </div>
      <div className="relative rounded-md p-4 bg-white border-border border-[1px] flex flex-wrap gap-4 w-full flex-1 items-center">
        <div className="w-full flex justify-between">
          <div className="relative">
            <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
              Transporte
            </span>
            <Input placeholder="Transporte" value={data.transport} disabled />
          </div>
          <div className="relative">
            <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
              Plano de venda
            </span>
            <Input
              placeholder="Plano de venda"
              value={data.planSale}
              disabled
            />
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[1rem] bg-white px-2">
            Observação
          </span>
          <Textarea
            placeholder="Observação"
            className="resize-none"
            value={data.obs}
            disabled
          />
        </div>
      </div>
      <div>
        <p>
          Valor total dos itens:
          {data.product
            .reduce((acc, p) => {
              return (
                acc +
                CalculateDiscount({
                  discount: p.discount,
                  price: p.price,
                  quantity: p.quantity,
                })
              )
            }, 0)
            .toLocaleString('pt-BR', {
              currency: 'BRL',
            })}
        </p>
      </div>
      <div className="w-full">
        <div className="rounded-md border bg-white/80 max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length &&
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </aside>
  )
}
