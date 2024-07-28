'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddingProduct } from '@/app/(main)/(home)/_components/adding-product'
import { Products, column } from '@/app/(main)/(home)/_components/column'
import Table from '@/app/(main)/(home)/_components/table'
import { createSale } from '@/lib/schema/sale'
import { generatePdf } from '@/services/pdf'
import { sendProcess } from '@/services/process'
import { Client, Prisma, Product } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  clients: Client[]
  dbProducts: Product[]
  fnSave: (data: any, id?: string | null) => Promise<any>
  fnGetById: (id: string) => any | Promise<Prisma.ProductSaleGetPayload<{
    include: {
      client: true,
      product: {
        include: {
          product: true
        }
      }
    }
  }>>
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

export default function FormCreateSale({ clients, dbProducts, fnSave, fnGetById }: Props) {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [linkGenerate, setLinkGenerate] = useState<string | null>(null)
  const id = useSearchParams().get("id")
  const router = useRouter()

  useEffect(() => {
    if (id) {
      (async () => {
        const result = await fnGetById(id)
        handleClientChange(result.client)
        setProducts(result.product.map(p => ({
          apres: p.product.apres,
          code: p.product.code,
          description: p.product.description,
          discount: p.discount,
          ipi: p.product.ipi,
          quantity: p.quantity,
          id: p.product.id,
          table: form.getValues("table"),
          table1: p.product.table1,
          table2: p.product.table2,
          table3: p.product.table3
        }) as ProductWithDetails))
        form.setValue("observation", result?.obs || "")
        form.setValue("conveyor", result.transport)
        form.setValue("planSell", result.planSale)
      })()
    }
  }, [id])

  const form = useForm<z.infer<typeof createSale>>({
    resolver: zodResolver(createSale),
    defaultValues: {
      date: new Date(),
      table: "table1"
    },
  })

  const handleDelete = (productToDelete: Products) => {
    setProducts(prev => prev.filter(e => productToDelete.id !== e.id))
  }

  const addingProduct = (newProduct: ProductWithDetails) => {
    setProducts((prev) => [...prev, newProduct])
  }
  const handleClientChange = ((client: Client) => {
    form.setValue('code', client.code ?? "")
    form.setValue('classification', client.classification ?? '')
    form.setValue('identification', client.identification ?? '')
    form.setValue('name', client.name ?? '')
    form.setValue('razaoSocial', client.razaoSocial ?? '')
    form.setValue('tell', client.tell ?? '')
    form.setValue('stateRegistration', client.stateRegistration ?? '')
    form.setValue('city', client.city ?? '')
    form.setValue('state', client.state ?? '')
  }
  )

  const handleSaveSketch = async () => {
    try {
      if (products.length === 0 && !form.getValues("email") && !form.getValues("tell")) {
        toast({
          title: 'Error',
          description: 'Necessário adicionar no mínimo 1 produto',
        })
        return
      }
      setLoading(true)
      await fnSave({ ...form.getValues(), products }, id)
      toast({
        description: "Salvo com sucesso"
      })
      setProducts([])
      form.setValue('code', '')
      form.setValue('classification', '')
      form.setValue('identification', '')
      form.setValue('name', '')
      form.setValue('razaoSocial', '')
      form.setValue('tell', '')
      form.setValue('stateRegistration', '')
      form.setValue('city', '')
      form.setValue('state', '')
      form.setValue('conveyor', '')
      form.setValue('planSell', '')
      form.setValue('observation', '')
    } catch (error) {
      console.log(error)
      toast({
        description: "Preencha todos os campos obrigatorios"
      })
    } finally {
      setLoading(false)
    }

  }
  const handleSubmit = async (data: z.infer<typeof createSale>) => {
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
        client: {
          city: data.city,
          classification: data.classification || "",
          code: data.classification || "",
          email: data.email || "",
          identification: data.identification || "",
          name: data.name || "",
          razaoSocial: data.razaoSocial || "",
          state: data.state || "",
          stateRegistration: data.stateRegistration || "",
          tell: data.tell,
        },
        date: data.date,
        observation: data.observation!,
        transportant: data.conveyor,
        planSell: data.planSell,
        products: products,
        isNewClient: data.isNewClient,
        table: data.table as 'table1' | 'table2' | 'table3',
      })
      toast({
        title: 'Pedido #' + numeroPedido,
        duration: 10000,
        description: 'Pedido gerado com sucesso',
      })
      router.push("/")
      setProducts([])
      form.setValue('code', '')
      form.setValue('classification', '')
      form.setValue('identification', '')
      form.setValue('name', '')
      form.setValue('razaoSocial', '')
      form.setValue('tell', '')
      form.setValue('stateRegistration', '')
      form.setValue('city', '')
      form.setValue('state', '')
      form.setValue('conveyor', '')
      form.setValue('planSell', '')
      form.setValue('observation', '')
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
  const handleGenerte = async () => {
    try {
      setLoading(true)
      const url = await generatePdf({
        products,
        client: {
          city: form.getValues("city"),
          classification: form.getValues("classification") || "",
          code: form.getValues("code"),
          email: form.getValues("email"),
          identification: form.getValues("identification") || "",
          name: form.getValues("name") || "",
          razaoSocial: form.getValues("razaoSocial") || "",
          state: form.getValues("state") || "",
          stateRegistration: form.getValues("stateRegistration") || "",
          tell: form.getValues("tell"),
        },
        view: true
      })
      console.log(url)
      setLinkGenerate(url)
    } catch (error) {
      toast({
        description: "Aconteceu algum error inesperado"
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
                <FormControl>
                  <DatePicker date={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Combobox
            data={clients}
            propsKey="name"
            key={'combobox-client'}
            fnAdd={(client: Client) => handleClientChange(client)}
          />
          <FormField
            control={form.control}
            name="isNewClient"
            render={({ field }) => (
              <FormItem className="flex flex-col  w-full ">
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
                      Novo cliente ?
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
            name="code"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Codigo</FormLabel>
                <FormControl>
                  <Input placeholder="Codigo" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Classificação</FormLabel>
                <FormControl>
                  <Input placeholder="Classificação" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Identificação</FormLabel>
                <FormControl>
                  <Input placeholder="Identificação" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="razaoSocial"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Razao social</FormLabel>
                <FormControl>
                  <Input placeholder="Razão social" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="tell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="stateRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Registro nacional</FormLabel>
                <FormControl>
                  <Input placeholder="Registro nacional" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="Estado" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" value={field.value} onChange={field.onChange} />
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
            name="table"
            render={() => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Informações</FormLabel>
                <FormControl>
                  <Combobox
                    key={'combobox-table'}
                    data={[
                      { table: 'table1', name: 'Tabela 01' },
                      { table: 'table2', name: 'Tabela 02' },
                      { table: 'table3', name: 'Tabela 03' },
                    ]}
                    fnAdd={(table: { table: string; name: string }) =>
                      form.setValue('table', table.name)
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
                <FormLabel className='text-[12px]'>Transporte</FormLabel>
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
                <FormLabel className='text-[12px]'>Condição de pagamento</FormLabel>
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
            <div className="flex gap-10 flex-wrap items-center">
              <Button
                disabled={loading}
                type="button"
                onClick={() => handleSaveSketch()}
                className="flex-grow-[1] flex gap-2 items-center"
              >
                {loading ? (
                  <>
                    <Spinner className="w-5 h-5" />
                    Salvando...
                  </>
                ) : (
                  'Salvar rascunho'
                )}
              </Button>
              {!linkGenerate &&
                <Button onClick={handleGenerte} className='text-sm text-center' variant={'outline'} type='button'>
                  Gerar pdf
                </Button>
              }
              {linkGenerate &&
                <Link className='text-sm text-center'
                  href={linkGenerate!}
                  download
                  target="_blank"
                  rel="noreferrer">
                  Download disponivel
                </Link>
              }

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
                  'Solicitar'
                )}
              </Button>
            </div>
            <AddingProduct
              data={dbProducts}
              fnAdd={addingProduct}
              table={form.getValues('table')}
            />
          </div>
        </div>
        <Table data={products} onDelete={handleDelete} />
      </form>
    </Form>
  )
}
