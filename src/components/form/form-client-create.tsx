'use client'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { z } from 'zod'
import { client } from '../../lib/schema/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

const clientNotId = client.omit({ id: true })

export type Client = z.TypeOf<typeof clientNotId>
type Props = {
  onCreate: (props: Client) => Promise<any>
}
export default function ClientForm({ onCreate }: Props) {
  const form = useForm<Client>({
    resolver: zodResolver(clientNotId),
  })
  const handleSubmit = async (data: Client) => {
    try {
      await onCreate(data)
      toast({
        title: 'Cliente',
        description: 'Cliente cadastrado com sucesso',
      })
      form.reset({
        city: '',
        classification: '',
        code: '',
        name: '',
        identification: '',
        razaoSocial: '',
        state: '',
        stateRegistration: '',
        tell: '',
        email: '',
      })
    } catch (error) {
      toast({
        title: 'Cliente',
        description: 'Error, cliente nao cadastrados com sucesso',
      })
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Cadastrar cliente</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-grow-[1]">
                      <FormLabel>Codigo</FormLabel>
                      <FormControl>
                        <Input placeholder="Codigo" {...field} />
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
                      <FormLabel>Classificacao</FormLabel>
                      <FormControl>
                        <Input placeholder="Classificacao" {...field} />
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
                      <FormLabel>Identificacao</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF/CNPJ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-grow-[1]">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
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
                      <FormLabel>Razao Social</FormLabel>
                      <FormControl>
                        <Input placeholder="Razao Social" {...field} />
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
                      <FormLabel>Registro nacional</FormLabel>
                      <FormControl>
                        <Input placeholder="Registro nacional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="tell"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-grow-[1]">
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone" {...field} />
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
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
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
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-grow-[1]">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="inline">
                Cadastrar
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
