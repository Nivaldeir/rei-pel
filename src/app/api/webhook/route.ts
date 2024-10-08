import { connectToDB } from "@/config/sql-server";
import { parseProductInfo } from "@/lib/html";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: Request
) {
  try {
    const output = await request.json();
    const products = parseProductInfo(output.properties["Itens selecionados"]);
    let codPed = output.properties["PEDIDO NR"]
    const pool = await connectToDB();
    
    const result = await pool.request().query(`
      SELECT * 
      FROM Ped p
      JOIN PedItem pi ON pi.cdPed = p.cdPed
      WHERE p.nPed = '${codPed}'
    `);
    console.log(result.recordset)
    const item = result.recordset.find(e => products.some(p => p.codigoProduto === e.apelido));

    
    await pool.request().query(`
      UPDATE pi
      SET pi.qtItem = 3, pi.qtEntregar = 3, pi.qtFaturar = 3
      FROM PedItem pi
      JOIN Ped p ON pi.cdPed = p.cdPed
      WHERE p.nPed = '${codPed}' AND pi.apelido = '${item.apelido}';
    `);
    return NextResponse.json({ error: false, body: output }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
