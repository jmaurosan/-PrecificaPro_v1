
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Calendar, CheckCircle2, AlertCircle, Download, X, Tag,
  Building, User, Briefcase, Printer, FileText, PieChart,
  ChevronRight, ArrowRight, Filter, Eye
} from 'lucide-react';
import { ContaPagar } from '../types';

const Financial: React.FC = () => {
  const navigate = useNavigate();
  const [payables, setPayables] = useState<ContaPagar[]>([
    {
      id: '1',
      prestadorId: 'p1',
      prestadorNome: 'Elite Smart Home',
      projetoId: 'p1',
      projetoNome: 'Apartamento Granja Viana',
      descricao: '1ª Parcela Mão de Obra Automação',
      valorTotal: 5000.00,
      dataVencimento: '2024-05-10',
      status: 'aberta',
      categoria: 'automacao'
    },
    {
      id: '2',
      prestadorId: 'p2',
      prestadorNome: 'Leroy Merlin',
      projetoId: 'p1',
      projetoNome: 'Apartamento Granja Viana',
      descricao: 'Materiais Hidráulicos Diversos',
      valorTotal: 1250.40,
      dataVencimento: '2024-04-20',
      status: 'paga',
      categoria: 'material'
    },
    {
      id: '3',
      prestadorId: 'p3',
      prestadorNome: 'Gesso Decora',
      projetoId: 'p2',
      projetoNome: 'Residência Alphaville',
      descricao: 'Sanca de Gesso Sala',
      valorTotal: 3200.00,
      dataVencimento: '2024-06-15',
      status: 'aberta',
      categoria: 'mao_de_obra'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ativas' | 'pagas'>('ativas');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extrai projetos únicos para o filtro
  const uniqueProjects = useMemo(() => {
    const names = payables.map(p => p.projetoNome);
    return Array.from(new Set(names));
  }, [payables]);

  const stats = useMemo(() => {
    const aPagar = payables.filter(p => p.status === 'aberta').reduce((acc, curr) => acc + curr.valorTotal, 0);
    const pagas = payables.filter(p => p.status === 'paga').reduce((acc, curr) => acc + curr.valorTotal, 0);
    
    return [
      { label: 'Total a Pagar (Geral)', value: `R$ ${aPagar.toLocaleString('pt-BR')}`, icon: Wallet, color: 'emerald' },
      { label: 'Obras Ativas', value: uniqueProjects.length.toString(), icon: Briefcase, color: 'indigo' },
      { label: 'Pago este Mês', value: `R$ ${pagas.toLocaleString('pt-BR')}`, icon: CheckCircle2, color: 'blue' }
    ];
  }, [payables, uniqueProjects]);

  const filteredPayables = useMemo(() => {
    return payables.filter(p => {
      const matchesStatus = statusFilter === 'ativas' ? p.status !== 'paga' : p.status === 'paga';
      const matchesProject = projectFilter === 'all' || p.projetoNome === projectFilter;
      const matchesSearch = p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.prestadorNome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesProject && matchesSearch;
    });
  }, [payables, statusFilter, projectFilter, searchTerm]);

  // Estado do Formulário
  const [formData, setFormData] = useState<Partial<ContaPagar>>({
    descricao: '',
    valorTotal: 0,
    dataVencimento: new Date().toISOString().split('T')[0],
    categoria: 'material',
    prestadorNome: '',
    projetoNome: 'Apartamento Granja Viana'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: ContaPagar = {
      id: Date.now().toString(),
      prestadorId: 'manual',
      prestadorNome: formData.prestadorNome || 'Fornecedor Avulso',
      projetoId: 'manual',
      projetoNome: formData.projetoNome || 'Geral',
      descricao: formData.descricao || '',
      valorTotal: formData.valorTotal || 0,
      dataVencimento: formData.dataVencimento || '',
      status: 'aberta',
      categoria: (formData.categoria as any) || 'material'
    };
    setPayables([newAccount, ...payables]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valorTotal: 0,
      dataVencimento: new Date().toISOString().split('T')[0],
      categoria: 'material',
      prestadorNome: '',
      projetoNome: 'Apartamento Granja Viana'
    });
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Financeiro Multiobras</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Visão consolidada de pagamentos de todas as suas frentes de trabalho.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setShowReportModal(true)} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-gray-600 transition-all shadow-sm hover:bg-gray-50 dark:text-gray-300"><Download size={20} /> Relatório</button>
           <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"><Plus size={20} /> Lançar Conta</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/20 dark:text-${stat.color}-400`}>
                <stat.icon size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <h2 className="text-xl font-black text-gray-900 dark:text-white">Extrato Consolidado</h2>
                 <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button onClick={() => setStatusFilter('ativas')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${statusFilter === 'ativas' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Abertas</button>
                    <button onClick={() => setStatusFilter('pagas')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${statusFilter === 'pagas' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400'}`}>Pagas</button>
                 </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-2xl">
                 <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Buscar por descrição ou prestador..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10" />
                 </div>
                 <div className="relative w-full sm:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                    <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-xs font-black text-emerald-700 dark:text-emerald-400 outline-none appearance-none cursor-pointer">
                       <option value="all">Todas as Obras</option>
                       {uniqueProjects.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                 </div>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Vencimento</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Obra / Projeto</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Prestador / Item</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredPayables.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group animate-in slide-in-from-left-2 duration-300">
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white tabular-nums">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(item.dataVencimento).toLocaleDateString('pt-BR')}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col gap-1">
                        <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-tighter w-fit border border-indigo-100 dark:border-indigo-800">
                           {item.projetoNome}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 dark:text-white leading-tight">{item.prestadorNome}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.descricao}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right text-sm font-black text-gray-900 dark:text-white tabular-nums">
                    R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-center">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                       item.status === 'paga' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'paga' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                        {item.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button title="Ver Dossiê da Obra" className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-300 hover:text-indigo-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Eye size={16}/>
                     </button>
                  </td>
                </tr>
              ))}
              {filteredPayables.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-24 text-center">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Filter className="text-gray-300" size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Nenhum lançamento para este filtro.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamento - Atualizado para selecionar Obra */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Lançar Nova Conta</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vincule a despesa a uma obra específica</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form id="financial-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">Vincular à Obra / Projeto</label>
                  <select required value={formData.projetoNome} onChange={(e) => setFormData({...formData, projetoNome: e.target.value})} className="w-full px-5 py-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl font-black text-indigo-600 dark:text-indigo-400 outline-none">
                    <option value="Apartamento Granja Viana">Apartamento Granja Viana</option>
                    <option value="Residência Alphaville">Residência Alphaville</option>
                    <option value="Loja Shopping Center">Loja Shopping Center</option>
                    <option value="Geral / Administrativo">Geral / Administrativo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição da Despesa</label>
                  <input required type="text" value={formData.descricao} onChange={(e) => setFormData({...formData, descricao: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white focus:border-emerald-500" placeholder="Ex: Pagamento 1/3 Tubulação PVC" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor / Prestador</label>
                    <input required type="text" value={formData.prestadorNome} onChange={(e) => setFormData({...formData, prestadorNome: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" placeholder="Ex: Leroy Merlin" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data de Vencimento</label>
                    <input required type="date" value={formData.dataVencimento} onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor Total (R$)</label>
                  <input required type="number" step="0.01" value={formData.valorTotal || ''} onChange={(e) => setFormData({...formData, valorTotal: parseFloat(e.target.value) || 0})} className="w-full px-5 py-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl font-black text-emerald-600 text-xl outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'mao_de_obra', label: 'Mão de Obra' },
                      { id: 'material', label: 'Material' },
                      { id: 'automacao', label: 'Automação' },
                      { id: 'projeto', label: 'Projeto' }
                    ].map(cat => (
                      <button key={cat.id} type="button" onClick={() => setFormData({...formData, categoria: cat.id as any})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${formData.categoria === cat.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}><Tag size={14} /> {cat.label}</button>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex gap-4 shrink-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-[40px]">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white dark:bg-gray-800 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px] border border-gray-100 dark:border-gray-700">Cancelar</button>
              <button form="financial-form" type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                  <CheckCircle2 size={18} /> Confirmar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
