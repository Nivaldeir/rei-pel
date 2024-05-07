import { Product } from "@prisma/client";

type GenericPropsDefault<T = unknown> = {
  children: React.ReactNode;
  className?: string;
} & T;

type ProductWithQuantity = {
  quantity: number;
  discount: number;
  table: string;
  product: Product;
};

import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      code: string;
      identification: string;
      id: string;
    };
  }
}
