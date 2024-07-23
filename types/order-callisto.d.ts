// export interface Callisto {
//   pedido: Order
//   pedidoItems: OrderItem[]
// }

type Order = {
  codigoPedidoEcommerce: string
  gerarPedido: string
  plano: string
  cliente: Client
  vendedor: string
  transportadora: string
  tipoFrete: string
  valorFrete: string
  MovimentacaoContabil: string
  tabelaPreco: string
  dataPedido: string
  login: string
  pago: string
  cdCidade: string
  estado: string
  logradouroE: string
  bairroE: string
  cepE: string
  numeroE: string
  complementoE: string
  observacaoPedido: string
  tipoCobranca: string
  credDebito: string
  prefixoCartao: string
  sufixoCartao: string
  NumDocumentoCartao: string
  NumAutorizacaoCartao: string
  idBandeiraCartao: number
}

type Client = {
  classificacao: string
  cpfCnpj: string
  nome: string
  razaoSocial: string
  cep: string
  endereco: string
  enderecoNumero: string
  enderecoComplemento: string
  bairro: string
  cidade: string
  estado: string
  email: string
  telefone: string
  inscricaoEstadual: string
  cidadeIBGE: string
  contribuinte: string
  consumidor: string
}

interface OrderItem {
  codigoProduto: string
  quantidade: number
  valor: number
  bonificado: string
  descontoPerc: number
  descontoValor: number
}
