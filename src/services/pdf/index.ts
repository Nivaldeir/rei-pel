'use server'
import { randomUUID } from 'crypto'
import { readFileSync, unlinkSync } from 'fs'
import { ProductWithDetails } from '@/components/form/form-create-sale'
import { htmlOrder } from '@/lib/html'
import { CalculateDiscount } from '@/lib/utils'
import { Client } from '@prisma/client'
import puppeteer from 'puppeteer'

type Props = {
  products: ProductWithDetails[]
  client?: Omit<Client, 'userId'> | any
  user?: any
  number?: string
  date?: Date
  observation?: string
  planSell?: string
  transport?: string
  path?: string
}

export async function generatePdf(props: Props) {
  const {
    client,
    date,
    products,
    number,
    observation,
    planSell,
    transport,
    path,
  } = props
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 120000,
  })
  const page = await browser.newPage()
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
    <section style="gap: 2rem; align-items: center;" class="flex">
      <aside style="position: relative;flex-directin:column." class="border flex">
        <h3 style="position: absolute; top: -32px; background-color: white; padding: 0 10px 0 10px;">Informações</h3>
        <div class="flex" style="gap: 1rem;width:100%; flex-wrap:wrap">
          <div class="flex">
            <p>Numero: </p>
            <p>${number}</p>
          </div>
          <div class="flex">
          <p>Data: </p>
          <p>${date?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })}</p>
        </div>
        <div class="flex">
          <p>Transportadora:</p>
          <p>${transport}</p >
        </div>
        <div class="flex">
          <p>Plano de venda: </p>
          <p>${planSell}</p>
        </div>
        <div class="flex">
          <p>Oberservação: </p>
          <p>${observation}</p>
        </div>
        </div>
      </aside>
      <aside style="position: relative;" class="border">
        <h3 style="position: absolute; top: -32px; background-color: white; padding: 0 10px 0 10px;">Solicitante</h3>
        <div class="flex" style="gap: 2rem;">
        <div class="flex">
        <p>CNPJ ou CPF:</p>
        <p>${client?.identification}</p>
      </div>
      <div class="flex">
        <p>Codigo:</p>
        <p>${client?.code}</p>
      </div>
      <div class="flex">
        <p>Raza Social:</p>
        <p>${client?.name}</p>
      </div>
      <div class="flex">
        <p>Cidade:</p>
        <p>${client?.city}</p>
      </div>
      <div class="flex">
        <p>Telefone:</p>
        <p>${client?.tell}</p>
      </div>
        </div>
      </aside>
    </section>
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
  await page.setContent(path ? htmlOrder(products) : htmlContent, {
    waitUntil: 'networkidle0',
  })
  const formattedDate = date?.toISOString().replace(/:/g, ' ')
  const pdfPath = process.cwd() + `/files/${formattedDate}_${randomUUID()}.pdf`
  page.setDefaultTimeout(120000)
  await page.pdf({ path: path ?? pdfPath, format: 'A4', waitForFonts: true })
  console.log(pdfPath)
  await browser.close()
  return pdfPath
}

export async function sendFilePdf(pathFile: string) {
  try {
    const fileContent = readFileSync(pathFile)
    const blob = new Blob([fileContent], { type: 'application/pdf' })
    const formData = new FormData()
    formData.append('file', blob, 'arquivo.pdf')

    const response = await fetch('https://app-api.holmesdoc.io/v1/documents', {
      signal: AbortSignal.timeout(5000),
      method: 'POST',
      headers: {
        api_token: process.env.api_token!,
      },
      body: formData,
    })
    console.log(response)
    const { id } = await response.json()

    return id
  } catch (error: any) {
    throw new Error(error)
  }
}
