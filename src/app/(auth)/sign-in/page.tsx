'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { LoginUser } from '@/lib/schema/user-sign'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof LoginUser>>({
    mode: 'onChange',
    resolver: zodResolver(LoginUser),
  })

  const handleSubmit = async (values: z.infer<typeof LoginUser>) => {
    const response = await signIn('credentials', {
      redirect: false,
      callbackUrl: '/',
      email: values.email,
      password: values.password,
    })
    if (response?.error) {
      toast({
        description: response.error,
      });
    } else {
      router.push('/');
    }
  }

  return (
    <div className="relative w-full h-full">
      <Image src={'/home.png'} fill alt="background page home" />
      <div className="z-20 absolute h-full w-full backdrop-blur-md flex justify-center items-center">
        <div className="bg-slate-300 flex flex-col items-center p-5 rounded-lg">
          <Form {...form}>
            <form
              className="w-full flex flex-col gap-4 items-center"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <h1 className="text-2xl font-semibold">Login</h1>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow-[1]">
                    <FormControl>
                      <Input
                        className="bg-white rounded-sm w-[350px]"
                        id="outlined-basic"
                        placeholder="Email"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-grow-[1]">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Senha"
                        className="bg-white rounded-sm w-[350px]"
                        autoComplete="false"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Logar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Page
