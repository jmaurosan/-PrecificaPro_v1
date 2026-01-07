
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users,
  Calculator,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  X,
  Check,
  Filter
} from 'lucide-react';

type Period = 'today' | 'last7' | 'thisMonth' | 'last30' | 'all';

// Mock de Banco de Dados para Cálculos
const MOCK_DATA = {
  proposals: [
    { id: '1', price: 15000, status: 'approved', date: new Date(), client: 'Cond. Solar' },
    { id: '2', price: 8500, status: 'sent', date: new Date(Date.now() - 86400000), client: 'Mauro Silva' },
    { id: '3', price: 25000, status: 'pending', date: new Date(Date.now() - 2 * 86400000), client: 'Empresa Alfa' },
    { id: '4', price: 12000, status: 'approved', date: new Date(Date.now() - 5 * 86400000), client: 'Res. Granja' },
    { id: '5', price: 3500, status: 'sent', date: new Date(Date.now() - 15 * 86400000), client: 'Loja Local' },
    { id: '6', price: 50000, status: 'approved', date: new Date(Date.now() - 45 * 86400000), client: 'Global Corp' },
  ],
  clients: [
    { id: 'c1', status: 'contratado', createdAt: new Date() },
    { id: 'c2', status: 'em_briefing', createdAt: new Date(Date.now() - 86400000) },
    { id: 'c3', status: 'novo', createdAt: new Date(Date.now() - 10 * 86400000) },
    { id: 'c4', status: 'contratado', createdAt: new Date(Date.now() - 40 * 86400000) },
  ]
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<Period>('thisMonth');

  const periodLabels: Record<Period, string> = {
    today: 'Hoje',
    last7: 'Últimos 7 dias',
    thisMonth: 'Este mês',
    last30: 'Últimos 30 dias',
    all: 'Todo o período'
  };

  // Lógica de Filtro por Data
  const isWithinPeriod = (date: Date, period: Period) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (period) {
      case 'today': return diffDays <= 1;
      case 'last7': return diffDays <= 7;
      case 'thisMonth': return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'last30': return diffDays <= 30;
      case 'all': return true;
      default: return false;
    }
  };

  // Cálculo Dinâmico dos Stats
  const stats = useMemo(() => {
    const filteredProposals = MOCK_DATA.proposals.filter(p => isWithinPeriod(p.date, filterPeriod));
    const filteredClients = MOCK_DATA.clients.filter(c => isWithinPeriod(c.createdAt, filterPeriod));

    // 1. Propostas Enviadas (Sent + Approved)
    const sentProposals = filteredProposals.filter(p => p.status === 'sent' || p.status === 'approved').length;

    // 2. Receita Estimada (Soma de Approved + Sent como potencial)
    const revenue = filteredProposals
      .filter(p => p.status === 'approved' || p.status === 'sent')
      .reduce((acc, curr) => acc + curr.price, 0);

    // 3. Clientes Ativos (Contratado + Briefing)
    const activeClients = filteredClients.filter(c => c.status === 'contratado' || c.status === 'em_briefing').length;

    // 4. Serviços Ativos (Baseado em propostas aprovadas)
    const activeServices = filteredProposals.filter(p => p.status === 'approved').length;

    return [
      { label: 'Propostas enviadas', value: sentProposals.toString(), change: '+15%', trend: 'up', icon: FileText, color: 'emerald' },
      { label: 'Receita estimada', value: `R$ ${revenue.toLocaleString('pt-BR')}`, change: '+8%', trend: 'up', icon: DollarSign, color: 'blue' },
      { label: 'Clientes ativos', value: activeClients.toString(), change: '+2', trend: 'up', icon: Users, color: 'purple' },
      { label: 'Serviços ativos', value: activeServices.toString(), change: '+1', trend: 'up', icon: Briefcase, color: 'orange' },
    ];
  }, [filterPeriod]);

  const recentProposals = useMemo(() => {
    return MOCK_DATA.proposals
      .filter(p => isWithinPeriod(p.date, filterPeriod))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [filterPeriod]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'sent': return 'Enviada';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Painel Principal</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg flex items-center gap-2">
            Resumo do período: 
            <span className="text-emerald-600 dark:text-emerald-400 font-black underline decoration-2 underline-offset-4">
              {periodLabels[filterPeriod]}
            </span>
          </p>
        </div>
        <button 
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-sm hover:bg-gray-50 hover:border-emerald-500 transition-all shadow-sm group"
        >
          <Filter size={18} className="text-gray-400 group-hover:text-emerald-500" />
          <span>Filtrar Período</span>
        </button>
      </div>

      {/* Cards de Estatísticas Funcionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Propostas Recentes</h2>
            <button 
              onClick={() => navigate('/proposals')}
              className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest hover:underline"
            >
              Ver Todas
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                  <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {recentProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{proposal.client}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{proposal.date.toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-sm text-gray-900 dark:text-white">
                      R$ {proposal.price.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(proposal.status)}`}>
                        {getStatusLabel(proposal.status)}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentProposals.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                      Nenhuma proposta no período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white px-2">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => navigate('/calculator')}
              className="group flex items-center gap-5 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-emerald-500 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                <Calculator size={32} />
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 dark:text-white text-lg">Novo Cálculo</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precificação Rápida</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/proposals')}
              className="group flex items-center gap-5 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-blue-500 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                <FileText size={32} />
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 dark:text-white text-lg">Criar Proposta</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orçamento Comercial</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/clients')}
              className="group flex items-center gap-5 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-purple-500 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                <Users size={32} />
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 dark:text-white text-lg">Novo Cliente</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cadastro de Leads</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Filtrar Período */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 pb-0 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Filtrar Período</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-3">
              {(Object.keys(periodLabels) as Period[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setFilterPeriod(key); setShowFilterModal(false); }}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all font-bold ${
                    filterPeriod === key 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                    : 'border-gray-50 dark:border-gray-900 hover:border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Calendar size={20} className={filterPeriod === key ? 'text-emerald-500' : 'text-gray-300'} />
                    {periodLabels[key]}
                  </div>
                  {filterPeriod === key && <Check size={20} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
