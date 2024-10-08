import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  // const { data } = req.body; // Supondo que você esteja enviando os dados no corpo da requisição
  const data = [
    {
      pedido: {
        codigoPedidoEcommerceExterno: Date.now(),
        gerarPedido: "S",
        plano: "sadwa",
        cliente: {
          classificacao: "J",
          cpfCnpj: "05112411000192",
          nome: "BRASPELL PAPELARIA EIRELI",
          razaoSocial: "BRASPELL PAPELARIA EIRELI",
          cep: "",
          endereco: "",
          enderecoNumero: "",
          enderecoComplemento: "",
          bairro: "",
          email: "sadwa",
          cidade: "Brasília",
          estado: "DF",
          telefone: "(61) 3964-9680",
          inscricaoEstadual: "0743501400182",
          cidadeIBGE: "5300108",
          contribuinte: "S",
          consumidor: "N",
        },
        vendedor: "Teste",
        transportadora: "REIPEL S.A",
        valorFrete: "12.000",
        MovimentacaoContabil: "VENDA",
        tabelaPreco: "table1",
        dataPedido: "2024-Oct-07 23:27:17.BRT",
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
      pedidoItems: [
        {
          codigoProduto: "104285",
          quantidade: 1,
          valor: 18.95,
          bonificado: "N",
          descontoPerc: 0,
        },
      ],
    },
  ];
  console.log(`http://${process.env.CALLISTOR_HOST}/pedido/salvar`);
  // try {
    const response = await axios.post(
      `http://${process.env.CALLISTOR_HOST}/pedido/salvar`,
      data,
      {
        timeout: 100000,
        auth: {
          username: process.env.USERNAME_CALLISTOR_AUTH!,
          password: process.env.PASSWORD_CALLISTOR_AUTH!,
        },
      }
    );
    console.log(response.data);
    // Retorne a resposta da API externa
    return NextResponse.json({ error: false }, { status: 200 });
  // } catch (error: any) {
  //   return NextResponse.json({ error: error.message });
  // }
}
