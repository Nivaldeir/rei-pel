"use server";

import { authNextOptions } from "@/config/auth-config";
import { CalculateDiscount } from "@/lib/utils";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { db } from "../lib/db";
import { createOrderCallisto } from "./callistor";
import { generatePdf } from "./generate-pdf";
import { createSale } from "@/lib/schema/sale";
import { z } from "zod";
import { ProductWithDetails } from "@/@types/products";
import { sendProducts } from "@/lib/products";

type Props = {
  details: z.infer<typeof createSale>;
  products: ProductWithDetails[];
  id: string | null;
  // codePedido: string;
  // codePedidoEcommerce: string;
  // numeroPedido: string;
};

export async function sendProcess({
  details,
  products,
  id,
}: Props) {
  const session = (await getServerSession(authNextOptions)) as any;
  const order = await createOrderCallisto({
    details: details,
    products: products,
    session
  })
  console.log(order)
  const idFile = await generatePdf({ details, products });
  const { ids, quantity } = await sendProducts(products);
  const total = products.reduce((total, acc) => {
    return (
      total +
      CalculateDiscount({
        discount: acc.discount,
        quantity: acc.quantity,
        price: acc[acc.table],
      })
    );
  }, 0);
  const bodyRequest = {
    workflow: {
      start_event: "Event_12ayq4t",
      whats: "",
      property_values: [
        {
          id: "a0c093e0-e54a-11ee-a9f2-5fe5357cab11",
          value: order.numeroPedido,
        },
        {
          id: "ac7d7db0-e54a-11ee-a9f2-5fe5357cab11",
          value: new Date(),
        },
        {
          id: "b5576bd0-e54a-11ee-a9f2-5fe5357cab11",
          value: total.toString(),
        },
        {
          id: "db4aff50-e54a-11ee-a9f2-5fe5357cab11",
          value: quantity,
        },
        {
          id: "2af91960-e54b-11ee-a9f2-5fe5357cab11",
          value: session.user.representative,
        },
        {
          id: "d4a26cc0-ec74-11ee-bdc5-1f81834439d2",
          value: session.user.email,
        },
        {
          id: "1093bc50-e600-11ee-95f4-e74d3ca411fb",
          value: details.code,
        },
        {
          id: "8d161f80-f6a8-11ee-89fa-0f79806dd97c",
          value: details.razaoSocial,
        },
        {
          id: "27fdc580-4608-11ef-85ae-4b07c6bfe166",
          value: details.isNewClient ? "Sim" : "Nao",
        },
        {
          id: "817acd60-e884-11ee-8384-6bbabc919fb2",
          value: details.identification,
        },
        {
          id: "8f40a370-e54b-11ee-a9f2-5fe5357cab11",
          value: details.planSell,
        },
        {
          id: "93a424a0-e54b-11ee-a9f2-5fe5357cab11",
          value: details.conveyor,
        },
        {
          id: "a8c08040-e54b-11ee-a9f2-5fe5357cab11",
          value: details.table,
        },
        {
          id: "fd79f440-e54b-11ee-a9f2-5fe5357cab11",
          value: details.observation,
        },
        {
          id: "3ef54230-60c1-11ef-ac4c-7d3713976fb8",
          value: order.numeroPedido,
        },
        ...ids,
      ],
      documents: [
        {
          usage_id: "a8eaad00-eabb-11ee-8422-572674897009",
          file_id: idFile,
        },
      ],
      test: false,
    },
  };
  await axios({
    method: "post",
    url: "https://app-api.holmesdoc.io/v1/workflows/65f09b520e9ee4008b350546/start",
    data: bodyRequest,
    headers: {
      api_token: process.env.api_token!,
    },
  });

  if (id) {
    try {
      await db.productSale.delete({
        where: { id },
      });
    } catch (error) {}
  }
  try {
    await db.productSale.create({
      data: {
        codePedido: order.codigoPedido.toString(),
        codePedidoEcommerce: order.codigoPedidoEcommerce.toString(),
        numeroPedido: order.numeroPedido,
        clientId: details.code,
        status: "FINISH",
        product: {
          createMany: {
            data: products.map((p) => ({
              code: p.code,
              description: p.description,
              price: parseFloat(p[p.table]) * p.quantity,
              quantity: parseInt(p.quantity.toString()),
              discount: p.discount,
              productId: p.id,
            })),
          },
        },
        userId: session?.user.id,
        obs: details.observation,
        planSale: details.planSell,
        transport: details.conveyor,
      },
    });
    return {
      numeroPedido: order.numeroPedido,
    };
  } catch (error) {
    throw error;
  }
}
