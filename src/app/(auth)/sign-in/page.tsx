"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginUser } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
type Props = {};

const Page = ({}: Props) => {
  const form = useForm<z.infer<typeof LoginUser>>({
    mode: "onChange",
    resolver: zodResolver(LoginUser),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (values: z.infer<typeof LoginUser>) => {
    const res = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      email: values.email,
      password: values.password,
    });
    console.log(res);
  };
  return (
    <div>
      <Image src={"/home.png"} fill alt="background page home" />
      <div className="z-20 absolute h-full w-full backdrop-blur-md flex justify-center items-center">
        <div className=" bg-slate-300 flex flex-col items-center p-5 rounded-lg">
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
                      <TextField
                        label="Email"
                        className="bg-white rounded-sm w-[350px]"
                        id="outlined-basic"
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
                      <TextField
                        label="Senha"
                        type="password"
                        className="bg-white rounded-sm w-[350px]"
                        autoComplete="false"
                        id="outlined-basic"
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
  );
};

export default Page;
