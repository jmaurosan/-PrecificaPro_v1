
export * from './projetoOrcamentoEtapas';

export type TipoPessoa = 'PF' | 'PJ';
export type TipoImovel = 'apartamento' | 'casa' | 'comercial' | 'terreno';
export type SituacaoPosse = 'proprietario' | 'locatario';
export type StatusLead = 'novo' | 'em_briefing' | 'proposta_enviada' | 'contratado' | 'perdido';

export interface CompanyProfile {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  website: string;
  logo: string | null;
  address: Endereco;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company: string;
  createdAt: Date;
  companyProfile?: CompanyProfile;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  quadra?: string;
  lote?: string;
}

export interface Prestador {
  id: string;
  tipoCadastro: TipoPessoa;
  nome: string;
  razaoSocial?: string;
  cpfCnpj: string;
  ramoAtividade: string;
  categoriaPrincipal: string;
  subcategorias: string[];
  atuaEmAutomacaoResidencial: boolean;
  tiposSistemasAutomacao: string[];
  marcasTrabalhadas: string[];
  email: string;
  telefoneCelular: string;
  whatsapp?: string;
  statusCadastro: 'em_analise' | 'aprovado' | 'bloqueado';
  notaMedia?: number;
}

export interface ContaPagar {
  id: string;
  prestadorId: string;
  prestadorNome: string;
  projetoId?: string;
  projetoNome?: string;
  descricao: string;
  valorTotal: number;
  dataVencimento: string;
  status: 'aberta' | 'parcialmente_paga' | 'paga' | 'cancelada';
  categoria: 'mao_de_obra' | 'material' | 'automacao' | 'projeto';
}

export interface Client {
  id: string;
  tipo: TipoPessoa;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefones: { celular: string; whatsapp: string; };
  enderecoCorrespondencia?: Endereco;
  imovel: {
    tipo: TipoImovel;
    endereco: Endereco;
    metragemM2: number;
    situacaoPosse: SituacaoPosse;
    condominio?: { nome: string };
  };
  status: StatusLead;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  totalBudget: number;
  spentAmount: number;
  startDate: string;
  status: 'active' | 'completed' | 'paused';
}

export interface ProjectExpense {
  id: string;
  projectId: string;
  description: string;
  location: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  date: string;
  type: 'expense' | 'return';
  receiptImage?: string;
}