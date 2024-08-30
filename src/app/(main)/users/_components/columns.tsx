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
import { ArrowUpDown, Ellipsis } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from '@/components/ui/use-toast'

type User = {
  id: string
  type: string
  city: string
  code: string
  representative: string
  email: string
  password: string
  clients: any[]
  isAdmin: boolean
}

type Props = {
  data: any[]
  fnUpdate: (prevId: string, nextId: string) => void
}

const ClientUpdater = ({
  id,
  data,
  fnUpdate,
}: {
  id: string
  data: any[]
  fnUpdate: (prevId: string, nextId: string) => void
}) => {
  const [representative, setRepresentative] = useState<any>()

  const handleClientUpdate = () => {
    if (representative?.id) {
      console.log(representative)
      fnUpdate(id, representative.id)
      toast({
        title: 'Sucesso',
      })
    }
  }

  return (
    <>
      <CustomModal>
        <h1 className="text-center">Troque os clientes de representantes</h1>
        {/* <Combobox
          data={data}
          fnAdd={setRepresentative}
          propsKey="representative"
        /> */}
        <Button onClick={handleClientUpdate}>Mover os clientes</Button>
      </CustomModal>
    </>
  )
}

export function columns({ data, fnUpdate }: Props): ColumnDef<User>[] {
  const { setOpen: setOpenModal } = useModal()
  const openModal = (id: string) => {
    setOpenModal(
      <ClientUpdater
        id={id}
        data={data.filter((c) => c.id !== id)}
        fnUpdate={fnUpdate}
      />,
    )
  }

  return [
    {
      accessorKey: 'representative',
      header: 'Representante',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('representative')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'isAdmin',
      header: () => <p className="text-center inline ">Ações</p>,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="">Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => openModal(row.original.id)}
                >
                  <span>Mudar clientes</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
