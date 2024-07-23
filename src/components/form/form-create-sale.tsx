'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddingProduct } from '@/app/(main)/(home)/_components/adding-product'
import { Products, column } from '@/app/(main)/(home)/_components/column'
import Table from '@/app/(main)/(home)/_components/table'
import { authNextOptions } from '@/config/auth-config'
import { createSale } from '@/lib/schema/sale'
import { generatePdf } from '@/services/pdf'
import { sendProcess } from '@/services/process'
import { Client, Product } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Combobox } from '../globals/combo-box'
import { Spinner } from '../globals/spinner'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { DatePicker } from '../ui/data-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { toast } from '../ui/use-toast'

type Props = {
  clients: Client[]
  dbProducts: Product[]
}

export interface ProductWithDetails {
  id: string
  code: string
  description: string
  apres: string
  ipi: string
  table1: number
  table2: number
  table3: number
  discount: number
  quantity: number
  table: string
}

export default function FormCreateSale({ clients, dbProducts }: Props) {
  const { data } = useSession(authNextOptions) as any
  const [link, setLinkDownloadPDF] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof createSale>>({
    resolver: zodResolver(createSale),
    defaultValues: {
      date: new Date(),
      tablePrice: { table: 'table1', name: 'Tabela 01' },
      isNewClient: false,
      client: {
        code: '',
        classification: '',
        identification: '',
        name: '',
        razaoSocial: '',
        tell: '',
        stateRegistration: '',
        city: '',
        state: '',
        email: '',
      },
      products: [],
      observation: '',
      conveyor: '',
      planSell: '',
    },
  })

  useEffect(() => {
    form.setValue('products', products)
  }, [products])

  const handleDelete = useCallback(
    (productToDelete: Products) => {
      const currentProducts: ProductWithDetails[] =
        form.getValues('products') || []
      const productFilter = currentProducts.filter(
        (p) => productToDelete.id !== p.id,
      )
      setProducts(productFilter)
    },
    [form],
  )

  const handleAdd = useCallback((newProduct: ProductWithDetails) => {
    setProducts((prev) => [...prev, newProduct])
  }, [])
  const handleClientChange = useCallback(
    (client: Client) => {
      form.setValue('client.code', client.code)
      form.setValue('client.classification', client.classification ?? '')
      form.setValue('client.identification', client.identification ?? '')
      form.setValue('client.name', client.name ?? '')
      form.setValue('client.razaoSocial', client.razaoSocial ?? '')
      form.setValue('client.tell', client.tell || '')
      form.setValue('client.stateRegistration', client.stateRegistration ?? '')
      form.setValue('client.city', client.city ?? '')
      form.setValue('client.state', client.state ?? '')
      form.setValue('client.email', client.email ?? '')
    },
    [form],
  )
  // const handleGenerateLink = async () => {
  //   try {
  //     const email = form.getValues('client.email')
  //     const procuctsForm = form.getValues('products')
  //     if (procuctsForm.length === 0 || !email || !form.getValues('planSell')) {
  //       throw new Error(
  //         'Necessário adicionar no mínimo 1 produto, cliente e condição de pagamento',
  //       )
  //     }

  //     const pdfPath = `public/${data?.user.id}.pdf`
  //     console.log('PDF Path:', pdfPath)

  //     await generatePdf({
  //       products,
  //       path: pdfPath,
  //     })
  //     setLinkDownloadPDF(`/${data?.user.id}.pdf`)
  //   } catch (error) {
  //     console.error('Error generating PDF:', error)
  //     toast({
  //       title: 'Error',
  //       description: error.message,
  //     })
  //   }
  // }

  const handleSubmit = async (formData: z.infer<typeof createSale>) => {
    try {
      if (products.length === 0) {
        toast({
          title: 'Error',
          description: 'Necessário adicionar no mínimo 1 produto',
        })
        return
      }
      setLoading(true)
      const { numeroPedido } = await sendProcess({
        client: formData.client as any,
        date: formData.date,
        observation: formData.observation!,
        transportant: formData.conveyor,
        planSell: formData.planSell,
        products: formData.products,
        isNewClient: formData.isNewClient,
        table: formData.tablePrice.table as 'table1' | 'table2' | 'table3',
        total: 0,
      })
      toast({
        title: 'Pedido #' + numeroPedido,
        duration: 10000,
        description: 'Pedido gerado com sucesso',
      })
      setProducts([])
      form.reset({})
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-4 max-sm:flex-col items-center">
          <FormField
            control={form.control}
            disabled={loading}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client"
            render={() => (
              <FormItem className="flex flex-col  w-full ">
                <FormLabel>Cliente</FormLabel>
                <FormControl className="w-full ">
                  <Combobox
                    data={clients}
                    propsKey="name"
                    key={'combobox-client'}
                    fnAdd={(client: Client) => handleClientChange(client)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isNewClient"
            render={({ field }) => (
              <FormItem className="flex flex-col  w-full ">
                <FormLabel>Novo cliente</FormLabel>
                <FormControl className="w-full ">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Novo cliente?
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="relative mt-4 rounded-md p-4 bg-white border-border border-[1px] flex flex-wrap gap-4 w-full flex-1 ">
          <span className="absolute top-[-13px] bg-white px-3">Cliente</span>
          <FormField
            control={form.control}
            name="client.code"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Codigo
                    </span>
                    <Input placeholder="Codigo" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.classification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Classificação
                    </span>
                    <Input placeholder="Classificação" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.identification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Identificação
                    </span>
                    <Input placeholder="Identificação" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            name="client.name"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Nome
                    </span>
                    <Input placeholder="Nome" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.razaoSocial"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Razao social
                    </span>
                    <Input placeholder="Razão social" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.tell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Telefone
                    </span>
                    <Input placeholder="Telefone" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.stateRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Registro nacional
                    </span>
                    <Input placeholder="Registro nacional" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.city"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Cidade
                    </span>
                    <Input placeholder="Cidade" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.state"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Estado
                    </span>
                    <Input placeholder="Estado" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="client.email"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-2 text-[10px] text-zinc-500/70 -top-[.5rem] bg-white px-2">
                      Email
                    </span>
                    <Input placeholder="Email" value={field.value} onChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="relative rounded-md p-4 bg-white border-border border-[1px] flex flex-wrap gap-4 w-full flex-1 items-center">
          <span className="absolute top-[-13px] bg-white px-3">
            Informações
          </span>
          <FormField
            disabled={loading}
            control={form.control}
            name="tablePrice"
            render={() => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <Combobox
                    key={'combobox-table'}
                    data={[
                      { table: 'table1', name: 'Tabela 01' },
                      { table: 'table2', name: 'Tabela 02' },
                      { table: 'table3', name: 'Tabela 03' },
                    ]}
                    fnAdd={(table: { table: string; name: string }) =>
                      form.setValue('tablePrice', table)
                    }
                    propsKey="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="conveyor"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <Input placeholder="Transporte" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="planSell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormControl>
                  <Input placeholder="Condição de pagamento" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Observação"
                    className="resize-none"
                    value={field.value} onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap">
            <div className="flex gap-10 flex-wrap">
              <Button
                disabled={loading}
                type="submit"
                className="flex-grow-[1] flex gap-2 items-center"
              >
                {loading ? (
                  <>
                    <Spinner className="w-5 h-5" />
                    Solicitando...
                  </>
                ) : (
                  'Finalizar'
                )}
              </Button>
              {/* {link == null && (
                <Button
                  variant={'ghost'}
                  onClick={handleGenerateLink}
                  type="button"
                  disabled={loading}
                  className="hover:underline"
                >
                  Gerar PDF
                </Button>
              )} */}
              {link && (
                <Link
                  href={link}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  Baixar em PDF
                </Link>
              )}
            </div>
            <AddingProduct
              data={dbProducts}
              fnAdd={handleAdd}
              table={form.getValues('tablePrice.table')}
            />
          </div>
        </div>
        <Table data={products} onDelete={handleDelete} />
      </form>
    </Form>
  )
}
