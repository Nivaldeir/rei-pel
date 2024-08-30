"use client"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

const formSettings = z.object({
  city: z.string().optional(),
  representative: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional()
})

type Props = {
  data: User
  fnUpdate: (data: any) => Promise<unknown>
}
export const FormSettings = ({ data, fnUpdate }: Props) => {
  const form = useForm<z.infer<typeof formSettings>>({
    resolver: zodResolver(formSettings),
    defaultValues: data
  })
  const handleSubmit = (data: z.infer<typeof formSettings>) => {
    const response = fnUpdate({ ...data }) as boolean | any
    if (response) {
      toast({
        description: "Salvo com sucesso"
      })
    } else {
      toast({
        description: response.error
      })
    }
  }
  return <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="md:grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-1">
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="representative"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col col-span-">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Senha" type="password" onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  </Form>
}