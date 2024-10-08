"use server";
import fetch from "node-fetch";
import FormData from "form-data";
import { Readable } from "stream";
import { uploadPDFFromLocal } from "@/lib/firebase";
import { z } from "zod";
import { createSale } from "@/lib/schema/sale";
import { Cluster } from "puppeteer-cluster";
import { ProductWithDetails } from "@/@types/products";
import { OrderHtml } from "@/lib/html";
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
        // executablePath: "/usr/bin/chromium",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--headless=new", // Usar novo modo headless
          "--disable-dev-shm-usage", // Evitar problemas de memória
        ],
      },
    });
    let tableHtml = OrderHtml(
      products,
      view,
      props.details,
      number?.toString()
    );
    console.log(tableHtml)
    let downloadURL: string = "";
    await cluster.queue(async ({ page }) => {
      await page.setContent(tableHtml, {
        waitUntil: "networkidle0",
      });
      const pdfPath = process.cwd() + `/files/${details!.code}.pdf`;
      await page.pdf({ path: pdfPath, format: "A4", waitForFonts: true });
      downloadURL = await uploadPDFFromLocal(pdfPath);
    });

    await cluster.idle();
    await cluster.close();
    if (view) return downloadURL;
    const documentId = await sendAndGenerate(downloadURL);
    console.log(documentId);
    return documentId;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF.");
  }
}
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
