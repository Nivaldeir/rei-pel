"use server";
import { ProductWithDetails } from "@/components/form/form-create-sale";
import { CalculateDiscount } from "@/lib/utils";
import fetch from "node-fetch";
import FormData from "form-data";
import { Readable } from "stream";
import { uploadPDFFromLocal } from "@/lib/firebase";
import { z } from "zod";
import { createSale } from "@/lib/schema/sale";
import { Cluster } from "puppeteer-cluster";
type Props = {
  details: z.infer<typeof createSale>;
  products: ProductWithDetails[];
  view?: boolean;
  number?: number;
};

export async function generatePdf(props: Props): Promise<string> {
  try {
    const { details, products, view, number } = props;
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 2,
      puppeteerOptions: {
        // executablePath: "/usr/bin/chromium-browser",
        timeout: 120000,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });
    let tableHtml = " ";
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
    let htmlHeaderContent = view
      ? ""
      : `    <section style="gap: 2rem; align-items: center;" class="flex">
      <aside style="position: relative;flex-directin:column." class="border flex">
        <h3 style="position: absolute; top: -32px; background-color: white; padding: 0 10px 0 10px;">Informações</h3>
        <div class="flex" style="gap: 1rem;width:100%; flex-wrap:wrap">
          <div class="flex">
            <p>Numero: </p>
            <p>${number ?? "000"}</p>
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
        <p>Total: ${products
          .reduce((acc, p) => acc + p[p.table] * p.quantity, 0)
          .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
      </aside>
    </section>
  </main>
</body>
</html>`;

    let downloadURL: string = "";
    await cluster.queue(async ({ page }) => {
      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
      });
      const pdfPath = process.cwd() + `/files/${details!.code}.pdf`;
      await page.pdf({ path: pdfPath, format: "A4", waitForFonts: true });
      downloadURL = await uploadPDFFromLocal(pdfPath);
    });

    await cluster.idle();
    await cluster.close();

    return downloadURL;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF.");
  }
}

// await page.setContent(htmlContent, {
//   waitUntil: "networkidle0",
// });
// const pdfPath = process.cwd() + `/files/${details!.code}.pdf`;
// page.setDefaultTimeout(120000);
// await page.pdf({ path: pdfPath, format: "A4", waitForFonts: true });
// const downloadURL = await uploadPDFFromLocal(pdfPath);
// console.log(downloadURL);
// await browser.close();
// if (view) return downloadURL;
// return sendAndGenerate(downloadURL);

export async function sendAndGenerate(urlPath: string) {
  const fileContent = await downloadPDF(urlPath);
  const documentId = await sendFilePdf(fileContent);
  return documentId;
}

async function sendFilePdf(fileContent: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(fileContent);
    const formData = new FormData();
    formData.append("file", Readable.from(buffer), "arquivo.pdf");

    const headers = formData.getHeaders();
    headers["api_token"] = process.env.api_token!;

    const response = await fetch("https://app-api.holmesdoc.io/v1/documents", {
      signal: AbortSignal.timeout(5000),
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to send PDF: ${response.statusText}`);
    }

    const responseData = (await response.json()) as any;
    const { id } = responseData;
    return id;
  } catch (error: any) {
    throw new Error(`Error sending PDF: ${error.message}`);
  }
}
async function downloadPDF(pdfUrl: string): Promise<ArrayBuffer> {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    return await response.arrayBuffer();
  } catch (error: any) {
    throw new Error(`Error downloading PDF: ${error.message}`);
  }
}
