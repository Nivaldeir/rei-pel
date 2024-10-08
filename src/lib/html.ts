import { ProductWithDetails } from "@/@types/products";
import { CalculateDiscount } from "./utils";
import { z } from "zod";
import { createSale } from "./schema/sale";

export function OrderHtml(
  products: ProductWithDetails[],
  view = false,
  details: z.infer<typeof createSale>,
  number: string = "0000"
) {
  let tableHtml = "";
  let htmlHeaderContent = "";
  if (view) {
    htmlHeaderContent = `<section style="gap: 2rem; align-items: center;" class="flex">
      <aside style="position: relative;flex-directin:column." class="border flex">
        <h3 style="position: absolute; top: -32px; background-color: white; padding: 0 10px 0 10px;">Informações</h3>
        <div class="flex" style="gap: 1rem;width:100%; flex-wrap:wrap">
          <div class="flex">
            <p>Numero: </p>
            <p>${number}</p>
          </div>
          <div class="flex">
          <p>Data: </p>
          <p>${new Date()?.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "America/Sao_Paulo",
          })}</p>
        </div>
        <div class="flex">
          <p>Transportadora:</p>
          <p>${details.conveyor}</p >
        </div>
        <div class="flex">
          <p>Plano de venda: </p>
          <p>${details.planSell}</p>
        </div>
        <div class="flex">
          <p>Oberservação: </p>
          <p>${details.observation}</p>
        </div>
        </div>
      </aside>
      <aside style="position: relative;" class="border">
        <h3 style="position: absolute; top: -32px; background-color: white; padding: 0 10px 0 10px;">Solicitante</h3>
        <div class="flex" style="gap: 2rem;">
        <div class="flex">
        <p>CNPJ ou CPF:</p>
        <p>${details.identification || " "}</p>
      </div>
      <div class="flex">
        <p>Codigo:</p>
        <p>${details.code || " "}</p>
      </div>
      <div class="flex">
        <p>Raza Social:</p>
        <p>${details.name || " "}</p>
      </div>
      <div class="flex">
        <p>Cidade:</p>
        <p>${details.city || " "}</p>
      </div>
      <div class="flex">
        <p>Telefone:</p>
        <p>${details.tell || " "}</p>
      </div>
        </div>
      </aside>
    </section>`;
  }
  products.forEach((p: any) => {
    tableHtml += `
  <tr>
      <td>${p.code ?? " "}</td>    
      <td>${p.description ?? " "}</td>    
      <td>${p.apres ?? " "}</td>    
      <td>${
        p[p.table].toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          style: "currency",
          currency: "BRL",
        }) ?? " "
      }</td>    
      <td>${p.discount ?? " "}%</td>    
      <td>${p.quantity ?? " "}</td>    
      <td>${
        CalculateDiscount({
          discount: p.discount,
          price: p[p.table],
          quantity: p.quantity,
        }).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          style: "currency",
          currency: "BRL",
        }) ?? " "
      }</td>    
  `;
    tableHtml += `</tr>`;
  });
  const htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
      body {
        font-family: "Roboto", sans-serif;
        font-weight: 300;
        font-style: normal;
      }

      p {
        font-size: 16px;
      }

      .flex {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .border {
        border: 1px solid gray;
        border-radius: 15px;
        padding: 1rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 15px;
      }

      table>th>td {
        background: #000;
      }

      th {
        font: 500;
      }

      th,
      td {
        border: 1px solid rgb(223, 223, 223);
        padding: 8px;
        text-align: center;
      }

      th {
        background-color: #f2f2f2;
      }
  </style>
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
    rel="stylesheet">
</head>

<body>
  <header>
    <h1>Solicitação de compras</h1>
  </header>
  <main>
  ${htmlHeaderContent}
    <section>
      <aside style="position: relative; margin-top: 2rem;" class="">
        <h3 style="position: absolute; top: -32px; background-color: white; padding: 0 10px 0 10px;">Produtos</h3>
        <table style="border-radius: 80px;">
          <thead style="">
            <td>Codigo</td>
            <td>Descrição</td>
            <td>Apress</td>
            <td>Preço</td>
            <td>Desconto</td>
            <td>Quantidade</td>
            <td>Total</td>
          </thead>
          <tbody>
            <tr style="background-color: rgb(234, 234, 234);;">
            ${tableHtml}
            </tr>
          </tbody>
        </table>
      </aside>
    </section>
  </main>
</body>
</html>`;
  return htmlContent;
}

interface Produto {
  codigoProduto: string;
  descricao: string;
  unidade: string;
  quantidade: number;
}

export function parseProductInfo(input: string): Produto[] {
  // Quebrar o texto em diferentes produtos com base no delimitador "|"
  const products = input.split('|').map(item => item.trim());

  // Array para armazenar os objetos dos produtos
  const result: Produto[] = [];

  // Expressão regular para capturar os detalhes do produto
  const regex = /Código do produto: (\d+)\s+Descrição: (.*?)\s+-\s+c\/\s+\d+\s+fls\s+Unidade: (\w+)\s+Quantidade: (\d+)/;

  // Iterar sobre cada produto e extrair os detalhes
  products.forEach(product => {
    const match = product.match(regex);
    if (match) {
      result.push({
        codigoProduto: match[1],
        descricao: match[2],
        unidade: match[3],
        quantidade: parseInt(match[4], 10)
      });
    }
  });

  return result;
}