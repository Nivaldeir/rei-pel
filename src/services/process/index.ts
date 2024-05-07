"use server";
import { Client, User } from "@prisma/client";
import { ProductWithQuantity } from "../../../types/global";
import { sendProducts } from "../product";
import axios from "axios";
import { generatePdf, sendFilePdf } from "../pdf";

type Props = {
  date: Date;
  total: number;
  client: Omit<Client, "userId">;
  user?: User;
  table: "table1" | "table2" | "table3";
  planSell: string;
  observation: string;
  transportant: string;
  products: ProductWithQuantity[];
};
export async function sendProcess(props: Props) {
  const {
    client,
    date,
    observation,
    planSell,
    products,
    table,
    total,
    transportant,
    user,
  } = props;
  const nameFile = await generatePdf({
    client,
    date,
    user,
    products,
    observation,
    planSell,
    transport: transportant,
  });
  const idFile = await sendFilePdf(nameFile);
  const { ids, quantity } = await sendProducts({
    products: products,
  });

  let bodyRequest = {
    workflow: {
      start_event: "Event_12ayq4t",
      whats: "",
      property_values: [
        // {
        //     id: "a0c093e0-e54a-11ee-a9f2-5fe5357cab11",
        //     value: number,
        // },
        {
          id: "ac7d7db0-e54a-11ee-a9f2-5fe5357cab11",
          value: date,
        },
        {
          id: "b5576bd0-e54a-11ee-a9f2-5fe5357cab11",
          value: total.toFixed(2),
        },
        {
          id: "db4aff50-e54a-11ee-a9f2-5fe5357cab11",
          value: quantity,
        },
        {
          id: "2af91960-e54b-11ee-a9f2-5fe5357cab11",
          value: client.name,
        },
        {
          id: "d4a26cc0-ec74-11ee-bdc5-1f81834439d2",
          value: client.identification,
        },
        {
          id: "1093bc50-e600-11ee-95f4-e74d3ca411fb",
          value: client.code,
        },
        {
          id: "817acd60-e884-11ee-8384-6bbabc919fb2",
          value: client.identification,
        },
        {
          id: "84a2be30-e54b-11ee-a9f2-5fe5357cab11",
          value: "Não cadastrado",
        },
        {
          id: "a9a19490-e884-11ee-8384-6bbabc919fb2",
          value: "Não cadastrado",
        },
        {
          id: "8f40a370-e54b-11ee-a9f2-5fe5357cab11",
          value: planSell,
        },
        {
          id: "93a424a0-e54b-11ee-a9f2-5fe5357cab11",
          value: transportant,
        },
        {
          id: "a8c08040-e54b-11ee-a9f2-5fe5357cab11",
          value: table,
        },
        {
          id: "fd79f440-e54b-11ee-a9f2-5fe5357cab11",
          value: observation,
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
  const res = await axios({
    method: "post",
    url: "https://app-api.holmesdoc.io/v1/workflows/65f09b520e9ee4008b350546/start",
    data: bodyRequest,
    headers: {
      api_token: process.env.api_token!,
    },
  });
  return {
    status: res.status,
  };
  console.log(res.status);
}
