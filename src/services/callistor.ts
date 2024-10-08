import { ProductWithDetails } from "@/@types/products";
import { createSale } from "@/lib/schema/sale";
import axios from "axios";
import { z } from "zod";
const ibgm = require("../constant/IBGM.json");
export type Props = {
  details: z.infer<typeof createSale>;
  products: ProductWithDetails[];
  session: any;
};
export async function createOrderCallisto(props: Props): Promise<{
  codigoPedidoEcommerce: number;
  codigoPedido: number;
  numeroPedido: string;
}> {
  try {
    const { details, products, session } = props;
    const body = [
      {
        pedido: {
          codigoPedidoEcommerceExterno: Date.now(),
          gerarPedido: "S",
          plano: details.planSell,
          cliente: {
            //@ts-ignore
            classificacao: details.classification[0].toUpperCase() || "",
            cpfCnpj: details.identification?.replace(/\D/g, "") ?? "",
            nome: details.name ?? "",
            razaoSocial: details.razaoSocial ?? "",
            cep: "",
            endereco: "",
            enderecoNumero: "",
            enderecoComplemento: "",
            bairro: "",
            email: details.email || "",
            cidade: details.city,
            estado: details.state,
            telefone: details.tell ?? "",
            inscricaoEstadual: details.stateRegistration,
            cidadeIBGE: ibgm[details.city!],
            contribuinte: "S",
            consumidor: "N",
          },
          vendedor: session?.user.representative,
          transportadora: "REIPEL S.A",
          valorFrete: "12.000",
          MovimentacaoContabil: "VENDA",
          tabelaPreco: details.table,
          dataPedido: formatDate(new Date()),
          login: "TATICA",
          pago: "N",
          cdCidade: "",
          estado: "",
          logradouroE: "",
          bairroE: "",
          cepE: "",
          numeroE: "",
          complementoE: "",
          observacaoPedido: "",
          tipoCobranca: "Sem Cobrança",
          credDebito: "",
          prefixoCartao: "",
          sufixoCartao: "",
          NumDocumentoCartao: "",
          NumAutorizacaoCartao: "",
          idBandeiraCartao: 0,
        },
        pedidoItems: products.map((p) => ({
          codigoProduto: p.code,
          quantidade: p.quantity,
          valor: p[p.table as "table1" | "table2" | "table3"],
          bonificado: "N",
          descontoPerc: p.discount,
        })),
      },
    ];

    const response = await axios.post(
      `http://${process.env.NEXT_PUBLIC_CALLISTOR_HOST}/pedido/salvar`,
      body,
      {
        timeout: 100000,
        auth: {
          password: process.env.NEXT_PUBLIC_PASSWORD_CALLISTOR_AUTH!,
          username: process.env.NEXT_PUBLIC_USERNAME_CALLISTOR_AUTH!,
        },
      }
    );
    const { object } = response.data[0];
    return object as {
      codigoPedidoEcommerce: number;
      codigoPedido: number;
      numeroPedido: string;
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function formatDate(date: Date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Sao_Paulo",
    hour12: false,
  } as any;
  const result = date
    .toLocaleString("en-US", options)
    .replace(",", "")
    .split(` `);
  const newDate = `${result[2].replace(`,`, ``)}-${result[0]}-${result[1]} ${
    result[3]
  }.BRT`;
  return newDate;
}
