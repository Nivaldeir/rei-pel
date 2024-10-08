import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fs from "fs";
import { ProductWithDetails } from "@/@types/products";
import { z } from "zod";
import { createSale } from "./schema/sale";
type Props = {
  details: z.infer<typeof createSale>;
  products: ProductWithDetails[];
  view?: boolean;
  number?: number;
};
export async function generatePDF(props: Props) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([600, 400]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const fontSize = 10;
  const headerFontSize = 12;

  page.drawText("Solicitação de compras", {
    x: 50,
    y: 350,
    size: headerFontSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  const tableStartY = 320;
  const cellHeight = 20;
  const descriptionCellWidth = 170;

  const headers = [
    "Código",
    "Descrição",
    "Apresentação",
    "Preço",
    "Desconto",
    "Quantidade",
    "Total",
  ];

  const headerXPositions = [50, 100, 290, 370, 430, 490, 550];

  headers.forEach((header, index) => {
    page.drawText(header, {
      x: headerXPositions[index],
      y: tableStartY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  function wrapText(text: string, width: number, fontSize: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const widthOfCurrentLine = font.widthOfTextAtSize(
        currentLine + word,
        fontSize
      );
      if (widthOfCurrentLine < width) {
        currentLine += word + " ";
      } else {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      }
    });

    lines.push(currentLine.trim());
    return lines;
  }

  // Dados da tabela
  const rowData = props.products.map((p) => [
    p.code,
    p.description,
    p.apres,
    p[p.table],
    p.discount,
    p.quantity,
    p.quantity * p[p.table],
  ]);
  // const rowData = [
  //   [
  //     "104285",
  //     "CARTÃO FOSCO AMARELO - c/ 20 fls",
  //     "Pct",
  //     "R$ 18,95",
  //     "0%",
  //     "1",
  //     "R$ 18,95",
  //   ],
  //   [
  //     "104285",
  //     "CARTÃO FOSCO AMARELO - c/ 20 flsCARTÃO FOSCO AMARELO - c/ 20 flsCARTÃO FOSCO AMARELO - c/ 20 flsCARTÃO FOSCO AMARELO - c/ 20 fls",
  //     "Pct",
  //     "R$ 18,95",
  //     "0%",
  //     "1",
  //     "R$ 18,95",
  //   ],
  // ];

  rowData.forEach((row, rowIndex) => {
    const yPosition = tableStartY - cellHeight * (rowIndex + 1);

    row.forEach((cell, cellIndex) => {
      if (cellIndex === 1) {
        const descriptionLines = wrapText(cell, descriptionCellWidth, fontSize);
        descriptionLines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: headerXPositions[cellIndex],
            y: yPosition - lineIndex * fontSize,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
        });
      } else {
        // Convertendo o valor para string antes de passar para o drawText
        page.drawText(String(cell), {
          x: headerXPositions[cellIndex],
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    });
  });

  // Salvar o PDF em um arquivo
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(process.cwd() + `/files/${props.details!.code}.pdf`, pdfBytes);

  console.log("PDF gerado com sucesso!");
}