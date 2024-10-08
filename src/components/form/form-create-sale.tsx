'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddingProduct } from '@/app/(main)/(home)/_components/adding-product'
import Table from '@/app/(main)/(home)/_components/table'
import { createSale } from '@/lib/schema/sale'
import { generatePdf } from '@/services/generate-pdf'
import { sendProcess } from '@/services/process'
import { Client, Prisma, Product } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Spinner } from '../globals/spinner'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { createOrderCallisto } from '@/services/callistor'
import { toast } from 'sonner'
import { ProductWithDetails } from '@/@types/products'
import { useSession } from 'next-auth/react'

type Props = {
  clients: Client[]
  dbProducts: Product[]
  fnSave: (data: any, id?: string | null) => Promise<any>
  fnGetById: (id: string) => Promise<any | Prisma.ProductSaleGetPayload<{
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

export default function FormCreateSale({ clients, dbProducts, fnSave, fnGetById }: Props) {
  const [clientsFilter, setClientsFilter] = useState(clients)
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)
  const [linkGenerate, setLinkGenerate] = useState<string | null>(null)
  const id = useSearchParams().get("id")
  const { data: session } = useSession()
  const form = useForm<z.infer<typeof createSale>>({
    resolver: zodResolver(createSale),
    defaultValues: {
      table: "table1"
    },
  })
  const handleDelete = (productToDelete: ProductWithDetails) => {
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
        toast.error("Necessário adicionar no mínimo 1 produto")
        return
      }
      setLoading(true)
      await fnSave({ ...form.getValues(), products }, id)
      toast.success("Salvo com sucesso")
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
      toast.error("Preencha todos os campos obrigatorios")
    } finally {
      setLoading(false)
    }

  }
  const handleSubmit = async (data: z.infer<typeof createSale>) => {
    try {
      if (products.length === 0) {
        toast.error('Necessário adicionar no menos 1 produto')
        return
      }
      setLoading(true)
      const response = await fetch("/api/callistor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details: data,
          products,
        }),
      });
      const order = await response.json()
      if(order.error) {
        toast.error('Aconteceu um error contate o suporte')
        return
      }
      const output = await sendProcess({
        id: id,
        details: data,
        products: products,
        codePedido: order.data[0].object.codigoPedido,
        codePedidoEcommerce: order.data[0].object.codigoPedidoEcommerce,
        numeroPedido: order.data[0].object.numeroPedido,
      })
      console.log("output", output)
      if(output.numeroPedido) {
        toast.success("Numero: #" + output.numeroPedido, { duration: 8000 })
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
        return
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleGenerete = async () => {
    try {
      setLoading(true)
      const url = await generatePdf({
        details: form.getValues(), 
        products,
      })
      console.log("url", url)
      setLinkGenerate(url)
    } catch (error) {
      toast.error("Aconteceu algum error inesperado")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      (async () => {
        const result = await fnGetById(id)
        if (result) {
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
          if (result.status == "FINISH") {
            setDisable(true)
          }
        }
      })()
    }
  }, [id])


  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-4 max-sm:flex-col items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between max-w-full overflow-hidden"
              >
                {form.getValues("razaoSocial") ??
                  'Selecione...'}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 ">
              <Command>
                <div className='p-1'>
                  <Input placeholder="Selecione..." disabled={loading || disable} className="h-9 " onChange={(params) => {
                    setClientsFilter(() => {
                      let inputFilter = params.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
                      const cl = clientsFilter.filter(p => {
                        console.log(p?.identification?.toString().replace(/[^a-zA-Z0-9 ]/g, ""))
                        if (p.code.toString().includes(params.target.value) || p?.identification?.toString().replace(/[^a-zA-Z0-9 ]/g, "").includes(inputFilter)) {
                          return p
                        }
                      })
                      if (!params.target.value) {
                        return clients
                      }
                      return cl
                    })
                  }} />
                </div>
                <CommandList>
                  <CommandEmpty>Não encontrado.</CommandEmpty>
                  <CommandGroup className=''>
                    {clientsFilter.map((c) => (
                      <CommandItem
                        className='w-full overflow-hidden'
                        key={c.code}
                        value={c.name || ""}
                        onSelect={() => {
                          handleClientChange(c)
                          setOpen(false)
                        }}
                      >
                        {c.razaoSocial}
                        <CheckIcon
                          className={cn(
                            'h-4 w-4',
                            form.getValues("razaoSocial") === c?.razaoSocial
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
                      disabled={loading || disable}
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
            
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Codigo</FormLabel>
                <FormControl>
                  <Input placeholder="Codigo" disabled value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            
            name="classification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Classificação</FormLabel>
                <FormControl>
                  <Input placeholder="Classificação" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            
            name="identification"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Identificação</FormLabel>
                <FormControl>
                  <Input placeholder="Identificação" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="name"
            
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            
            control={form.control}
            name="razaoSocial"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Razao social</FormLabel>
                <FormControl>
                  <Input placeholder="Razão social" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            
            control={form.control}
            name="tell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            
            control={form.control}
            name="stateRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Registro nacional</FormLabel>
                <FormControl>
                  <Input placeholder="Registro nacional" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" disabled value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="Estado" disabled  value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
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
            disabled={loading || disable}
            control={form.control}
            name="table"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Informações</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} disabled={loading || disable} defaultValue={field.value}>
                    <SelectTrigger className="max-w-[240px]">
                      <SelectValue placeholder="Selecione a tabela" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tabela</SelectLabel>
                        <SelectItem value="table1">Tabela 01</SelectItem>
                        <SelectItem value="table2">Tabela 02</SelectItem>
                        <SelectItem value="table3">Tabela 03</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading || disable}
            control={form.control}
            name="conveyor"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Transportadora</FormLabel>
                <FormControl>
                  <Input placeholder="Transportadora" disabled={loading || disable} value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading || disable}
            control={form.control}
            name="planSell"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-grow-[1]">
                <FormLabel className='text-[12px]'>Condição de pagamento</FormLabel>
                <FormControl>
                  <Input placeholder="Condição de pagamento" disabled={loading || disable} value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading || disable}
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
                disabled={loading || disable}
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
                <Button onClick={handleGenerete} className='text-sm text-center' variant={'outline'} type='button'>
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
                disabled={loading || disable}
                type="submit"
                className="flex-grow-[1] flex gap-2 items-center"
              >
                {loading ? (
                  <>
                    <Spinner className="w-5 h-5" />
                    Enviando...
                  </>
                ) : (
                  'Enviar pedido'
                )}
              </Button>
            </div>
            {!loading && !disable &&
              <AddingProduct
                data={dbProducts}
                fnAdd={addingProduct}
                table={form.getValues('table')}
              />
            }
          </div>
        </div>
        <Table data={products} onDelete={handleDelete} />
      </form>
    </Form>
  )
}