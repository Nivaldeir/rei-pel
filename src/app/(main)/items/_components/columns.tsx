<<<<<<< HEAD
import CustomModal from '@/components/globals/custom-modal'
import { useModal } from '@/components/providers/modal-provider'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Product as IProduct } from '@prisma/client'
import { Product } from './product'


type Props = {
  data: IProduct[]
  fnUpdate: (data: IProduct | any) => Promise<void>
  fnDelete: (id: string) => Promise<void>
}
export function columns({ data, fnDelete, fnUpdate }: Props): ColumnDef<IProduct>[] {
  const { setOpen } = useModal()

  return [
    {
      accessorKey: 'code',
      header: 'Codigo',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('code')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className='w-full'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Descrição
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('description')}</div>
      ),
    },
    {
      accessorKey: 'table1',
      header: () => <p className='text-center'>Tabela 01</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.table1.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency"
        })}</div>
      ),
    },
    {
      accessorKey: 'table2',
      header: () => <p className='text-center'>Tabela 02</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.table2.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency"
        })}</div>
      ),
    },
    {
      accessorKey: 'table3',
      header: () => <p className='text-center'>Tabela 03</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.table3.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency"
        })}</div>
      ),
    },
    {
      accessorKey: 'isActived',
      header: () => <p className='text-center'>Situação</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.isActived ? "Ativado" : "Desativado"}</div>
      ),
    },
    {
      accessorKey: 'actions',
      header: () => <p className='text-center'>Ações</p>,
      cell: ({ row }) => {
        const handleDelete = () => {
          setOpen(<CustomModal><DeleteConfirm fnDelete={fnDelete} id={row.original.id} /></CustomModal>)
        }
        const handleUpdate = () => {
          setOpen(<CustomModal><Product fn={fnUpdate} item={row.original} /></CustomModal>)
        }
        return <div className='w-full flex gap-4 justify-center'>
          <Pencil className='cursor-pointer ' onClick={handleUpdate} />
          <Trash2 className='cursor-pointer hover:fill-red-300' onClick={handleDelete} />
        </div>
      },
    },
  ]
}


function DeleteConfirm({ fnDelete, id }: { id: string, fnDelete: (id: string) => void }) {
  const { setClose } = useModal()
  return <div className='flex flex-col gap-4'>
    <h1 className='text-center'>Tem certeza que deseja desativar?</h1>
    <p className='text-center text-[10px]'>Os usuarios não terá acesso a esse produto</p>
    <div className=' flex justify-center gap-4'>
      <Button onClick={() => {
        fnDelete(id)
        toast({ description: "Produto desativado com sucesso" })
        setClose()
      }} variant={"destructive"} className='w-full'>Sim</Button>
      <Button onClick={() => setClose()} className='w-full'>Não</Button>
    </div>
  </div>
=======
import CustomModal from '@/components/globals/custom-modal'
import { useModal } from '@/components/providers/modal-provider'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Product as IProduct } from '@prisma/client'
import { Product } from './product'


type Props = {
  data: IProduct[]
  fnUpdate: (data: IProduct | any) => Promise<void>
  fnDelete: (id: string) => Promise<void>
}
export function columns({ data, fnDelete, fnUpdate }: Props): ColumnDef<IProduct>[] {
  const { setOpen } = useModal()

  return [
    {
      accessorKey: 'code',
      header: 'Codigo',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('code')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className='w-full'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Descrição
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('description')}</div>
      ),
    },
    {
      accessorKey: 'table1',
      header: () => <p className='text-center'>Tabela 01</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.table1.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency"
        })}</div>
      ),
    },
    {
      accessorKey: 'table2',
      header: () => <p className='text-center'>Tabela 02</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.table2.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency"
        })}</div>
      ),
    },
    {
      accessorKey: 'table3',
      header: () => <p className='text-center'>Tabela 03</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.table3.toLocaleString("pt-BR", {
          currency: "BRL",
          style: "currency"
        })}</div>
      ),
    },
    {
      accessorKey: 'isActived',
      header: () => <p className='text-center'>Situação</p>,
      cell: ({ row }) => (
        <div className='text-center'>{row.original.isActived ? "Ativado" : "Desativado"}</div>
      ),
    },
    {
      accessorKey: 'actions',
      header: () => <p className='text-center'>Ações</p>,
      cell: ({ row }) => {
        const handleDelete = () => {
          setOpen(<CustomModal><DeleteConfirm fnDelete={fnDelete} id={row.original.id} /></CustomModal>)
        }
        const handleUpdate = () => {
          setOpen(<CustomModal><Product fn={fnUpdate} item={row.original} /></CustomModal>)
        }
        return <div className='w-full flex gap-4 justify-center'>
          <Pencil className='cursor-pointer ' onClick={handleUpdate} />
          <Trash2 className='cursor-pointer hover:fill-red-300' onClick={handleDelete} />
        </div>
      },
    },
  ]
}


function DeleteConfirm({ fnDelete, id }: { id: string, fnDelete: (id: string) => void }) {
  const { setClose } = useModal()
  return <div className='flex flex-col gap-4'>
    <h1 className='text-center'>Tem certeza que deseja desativar?</h1>
    <p className='text-center text-[10px]'>Os usuarios não terá acesso a esse produto</p>
    <div className=' flex justify-center gap-4'>
      <Button onClick={() => {
        fnDelete(id)
        toast({ description: "Produto desativado com sucesso" })
        setClose()
      }} variant={"destructive"} className='w-full'>Sim</Button>
      <Button onClick={() => setClose()} className='w-full'>Não</Button>
    </div>
  </div>
>>>>>>> 081bbfcb3162f1389d7117f2c30339ff4dd7cb8a
}