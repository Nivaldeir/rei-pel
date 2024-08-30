'use client'
import { Client } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
export const column: ColumnDef<Client>[] = [
  {
    accessorKey: 'code',
    header: () => <div className="text-center">Codigo</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original?.code}</div>
    },
  },
  {
    accessorKey: 'name',
    header: () => <div className="text-center">Nome</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium  ">{row.original?.name}</div>
      )
    },
  },
  {
    accessorKey: 'stateRegistration',
    header: () => <div className="text-center">Registro nacional</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original?.stateRegistration}
        </div>
      )
    },
  },
  {
    accessorKey: 'stateRegistration',
    header: () => <div className="text-center">Classificacao</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original?.stateRegistration}
        </div>
      )
    },
  },
  {
    accessorKey: 'tell',
    header: () => <div className="text-center">Telefone</div>,
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original?.tell}</div>
    },
  },

  {
    accessorKey: '',
    header: 'Cidade',
    cell: ({ row }) => {
      const { city, state } = row.original
      return (
        <div className="text-left font-medium">
          {city} / {state}
        </div>
      )
    },
  },
]
