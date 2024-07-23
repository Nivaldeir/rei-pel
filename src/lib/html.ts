import { ProductWithDetails } from '@/components/form/form-create-sale'
import { CalculateDiscount } from './utils'

export function htmlOrder(products: ProductWithDetails[]) {
  let tableHtml = ' '
  products.forEach((p: any) => {
    tableHtml += `
  <tr>
      <td>${p.code ?? ' '}</td>    
      <td>${p.description ?? ' '}</td>    
      <td>${p.apres ?? ' '}</td>    
      <td>${
        p[p.table].toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL',
        }) ?? ' '
      }</td>    
      <td>${p.discount ?? ' '}%</td>    
      <td>${p.quantity ?? ' '}</td>    
      <td>${
        CalculateDiscount({
          discount: p.discount,
          price: p[p.table],
          quantity: p.quantity,
        }).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL',
        }) ?? ' '
      }</td>    
  `
    tableHtml += `</tr>`
  })
  const htmlContent = `
  <!DOCTYPE html>
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
</html>`
  return htmlContent
}
