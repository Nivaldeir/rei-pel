//@ts-nocheck
import { Client } from '@prisma/client'
import axios from 'axios'
const username = 'ti'
const password = 'ti2468**'
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
const ibgm = require('./IBGM.json')
export type Callisto = {
  plano: string
  date: Date
  client: Omit<Client, "userId">
  vendedor: string
  transportadora: string
  tabelaPreco: '1' | '2' | '3'
  observacaoPedido: string
  orders: [
    {
      codigoProduto: string
      quantidade: number
      valor: number
      bonificado: string
      descontoPerc: number
    },
  ]
}
export async function createOrderCallisto(props: Callisto) {
  // try {
  const { client } = props
  const response = await axios.post(
    'http://26.154.206.188:8084/WSIntegracaoERP/pedido/salvar',
    [
      {
        pedido: {
          codigoPedidoEcommerceExterno: Date.now(),
          gerarPedido: 'S',
          plano: props.plano,
          cliente: {
            classificacao: client?.classification[0].toUpperCase() || '',
            cpfCnpj: client.identification ?? '',
            nome: client?.name ?? '',
            razaoSocial: client.razaoSocial ?? '',
            cep: '',
            endereco: '',
            enderecoNumero: '',
            enderecoComplemento: '',
            bairro: '',
            email: '',
            cidade: client?.city,
            estado: client?.state,
            telefone: client?.tell ?? '',
            inscricaoEstadual: client.stateRegistration,
            cidadeIBGE: ibgm[client.city!],
            contribuinte: 'S',
            consumidor: 'N',
          },
          vendedor: props.vendedor,
          transportadora: 'REIPEL S.A',
          valorFrete: '12.000',
          MovimentacaoContabil: 'REVENDA',
          tabelaPreco: props.tabelaPreco,
          dataPedido: formatDate(props.date),
          login: 'ADMIN',
          pago: 'N',
          cdCidade: '',
          estado: '',
          logradouroE: '',
          bairroE: '',
          cepE: '',
          numeroE: '',
          complementoE: '',
          observacaoPedido: '',
          tipoCobranca: 'Sem Cobrança',
          credDebito: '',
          prefixoCartao: '',
          sufixoCartao: '',
          NumDocumentoCartao: '',
          NumAutorizacaoCartao: '',
          idBandeiraCartao: 0,
        },
        pedidoItems: props.orders,
      },
    ],
    {
      headers: {
        Authorization: `Basic ${token}`,
      },
    },
  )
  const { object } = response.data[0]
  return object as {
    codigoPedidoEcommerce: number
    codigoPedido: number
    numeroPedido: string
  }
  // } catch (error: any) {
  //   console.log('CATCH', error)
  //   throw new Error()
  // }
}

function formatDate(date: Date) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  } as any
  const result = date
    .toLocaleString('en-US', options)
    .replace(',', '')
    .split(` `)
  const newDate = `${result[2].replace(`,`, ``)}-${result[0]}-${result[1]} ${result[3]}.BRT`
  return newDate
}
