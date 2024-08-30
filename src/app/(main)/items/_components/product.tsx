<<<<<<< HEAD
'use client'
import { useModal } from "@/components/providers/modal-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Product as IProduct } from "@prisma/client"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"
import { z } from "zod"


const updateProduct = z.object({
  code: z.string({ required_error: 'É obrigatorio' }),
  description: z.string({ required_error: 'É obrigatorio' }),
  apres: z.string({ required_error: 'É obrigatorio' }),
  ipi: z.string({ required_error: 'É obrigatorio' }),
  table1: z
    .string({ required_error: 'É obrigatório' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Deve ser um número válido',
    })
    .transform((value) => Number(value)),
  table2: z
    .string({ required_error: 'É obrigatório' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Deve ser um número válido',
    })
    .transform((value) => Number(value)),
  table3: z
    .string({ required_error: 'É obrigatório' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Deve ser um número válido',
    })
    .transform((value) => Number(value)),
})

type Props = {
  item?: IProduct
  fn: (data: IProduct | z.infer<typeof updateProduct>) => Promise<void>
}
export const Product = ({ fn, item }: Props) => {
  const { setClose } = useModal()
  const form = useForm<z.infer<typeof updateProduct>>({
    resolver: zodResolver(updateProduct),
    defaultValues: { ...item }
  })
  const handleSubmit = async (data: z.infer<typeof updateProduct>) => {
    try {
      await fn(data)
      setClose()
      toast({
        description: "Salvo com sucesso"
      })
    } catch (error: any) {
      toast({
        description: error.message
      })
    }
  }
  return <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex gap-2 max-md:flex-col">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Codigo</Label>
              <FormControl>
                <Input placeholder="Codigo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apres"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Apres</Label>
              <FormControl>
                <Input placeholder="Apres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ipi"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Ipi</Label>
              <FormControl>
                <Input placeholder="Ipi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Label>Descriçãp</Label>
            <FormControl>
              <Input placeholder="Descrição" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-2 max-md:flex-col">
        <FormField
          control={form.control}
          name="table1"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Tabela 01</Label>
              <FormControl>
                <Input placeholder="Tabela 01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="table2"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Tabela 02</Label>
              <FormControl>
                <Input placeholder="Tabela 02" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="table3"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Tabela 03</Label>
              <FormControl>
                <Input placeholder="Tabela 03" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-end mt-4">

        <Button type="submit">Salvar</Button>
      </div>
    </form>
  </Form>
=======
'use client'
import { useModal } from "@/components/providers/modal-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Product as IProduct } from "@prisma/client"
import { Label } from "@radix-ui/react-label"
import { useForm } from "react-hook-form"
import { z } from "zod"


const updateProduct = z.object({
  code: z.string({ required_error: 'É obrigatorio' }),
  description: z.string({ required_error: 'É obrigatorio' }),
  apres: z.string({ required_error: 'É obrigatorio' }),
  ipi: z.string({ required_error: 'É obrigatorio' }),
  table1: z
    .string({ required_error: 'É obrigatório' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Deve ser um número válido',
    })
    .transform((value) => Number(value)),
  table2: z
    .string({ required_error: 'É obrigatório' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Deve ser um número válido',
    })
    .transform((value) => Number(value)),
  table3: z
    .string({ required_error: 'É obrigatório' })
    .refine((value) => !isNaN(Number(value)), {
      message: 'Deve ser um número válido',
    })
    .transform((value) => Number(value)),
})

type Props = {
  item?: IProduct
  fn: (data: IProduct | z.infer<typeof updateProduct>) => Promise<void>
}
export const Product = ({ fn, item }: Props) => {
  const { setClose } = useModal()
  const form = useForm<z.infer<typeof updateProduct>>({
    resolver: zodResolver(updateProduct),
    defaultValues: { ...item }
  })
  const handleSubmit = async (data: z.infer<typeof updateProduct>) => {
    try {
      await fn(data)
      setClose()
      toast({
        description: "Salvo com sucesso"
      })
    } catch (error: any) {
      toast({
        description: error.message
      })
    }
  }
  return <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex gap-2 max-md:flex-col">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Codigo</Label>
              <FormControl>
                <Input placeholder="Codigo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apres"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Apres</Label>
              <FormControl>
                <Input placeholder="Apres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ipi"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Ipi</Label>
              <FormControl>
                <Input placeholder="Ipi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <Label>Descriçãp</Label>
            <FormControl>
              <Input placeholder="Descrição" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-2 max-md:flex-col">
        <FormField
          control={form.control}
          name="table1"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Tabela 01</Label>
              <FormControl>
                <Input placeholder="Tabela 01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="table2"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Tabela 02</Label>
              <FormControl>
                <Input placeholder="Tabela 02" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="table3"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Tabela 03</Label>
              <FormControl>
                <Input placeholder="Tabela 03" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-end mt-4">

        <Button type="submit">Salvar</Button>
      </div>
    </form>
  </Form>
>>>>>>> 081bbfcb3162f1389d7117f2c30339ff4dd7cb8a
}