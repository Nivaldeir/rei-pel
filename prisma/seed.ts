import { db } from "@/services/database";
import excelToJson from "convert-excel-to-json";
const output = excelToJson({
  sourceFile: "prisma/base1.xlsx",
  columnToKey: {
    A: "code",
    B: "identification",
    C: "name",
    D: "razaoSocial",
    E: "stateRegistration",
    F: "classification",
    G: "tell",
  },
})["Planilha1"] as {
  code: string;
  identification: string;
  name: string;
  stateRegistration: string;
  razaoSocial: string;
  classification: string;
  tell: string;
}[];

const product = excelToJson({
  sourceFile: "prisma/pedidos.xls",
  columnToKey: {
    A: "code",
    B: "description",
    C: "apres",
    D: "ipi",
    G: "table1",
    H: "table2",
    I: "table3",
  },
})["Planilha de Produtos"] as {
  code: number;
  description: string;
  apres: string;
  ipi: number;
  table1: number;
  table2: number;
  table3: number;
}[];

main();

async function main() {
  let client = output
    .filter((e) => e.stateRegistration && e.tell)
    .map((e) => ({
      ...e,
      code: e.code.toString(),
    }));
  await db.client.createMany({
    data: client,
  });

  let result = product
    .filter((e) => e.code && e.apres && e.table1)
    .map((e) => ({
      code: e.code.toString(),
      description: e.description,
      apres: e.apres,
      ipi: e.ipi.toString(),
      table1: e.table1,
      table2: e.table2,
      table3: e.table3,
    }));

  await db.product.createMany({
    data: result,
  });
}

main();
