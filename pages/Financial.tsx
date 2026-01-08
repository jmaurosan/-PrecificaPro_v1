
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Calendar, CheckCircle2, AlertCircle, Download, X, Tag,
  Building, User, Briefcase, Printer, FileText, PieChart,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { ContaPagar } from '../types';

const Financial: React.FC = () => {
  const [payables, setPayables] = useState<ContaPagar[]>([
    {
      id: '1',
      prestadorId: 'p1',
      prestadorNome: 'Elite Smart Home',
      projetoId: 'pr1',
      projetoNome: 'Residência Granja Viana',
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
      projetoId: 'pr1',
      projetoNome: 'Residência Granja Viana',
      descricao: 'Materiais Hidráulicos Diversos',
      valorTotal: 1250.40,
      dataVencimento: '2024-04-20',
      status: 'paga',
      categoria: 'material'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filter, setFilter] = useState<'ativas' | 'pagas'>('ativas');
  
  // Estado do Formulário
  const [formData, setFormData] = useState<Partial<ContaPagar>>({
    descricao: '',
    valorTotal: 0,
    dataVencimento: new Date().toISOString().split('T')[0],
    categoria: 'material',
    prestadorNome: '',
    projetoNome: 'Geral / Administrativo'
  });

  const stats = useMemo(() => {
    const aPagar = payables.filter(p => p.status === 'aberta').reduce((acc, curr) => acc + curr.valorTotal, 0);
    const pagas = payables.filter(p => p.status === 'paga').reduce((acc, curr) => acc + curr.valorTotal, 0);
    
    return [
      { label: 'Total a Pagar', value: `R$ ${aPagar.toLocaleString('pt-BR')}`, icon: Wallet, color: 'emerald' },
      { label: 'Vencendo Hoje', value: 'R$ 0', icon: AlertCircle, color: 'rose' },
      { label: 'Pago este Mês', value: `R$ ${pagas.toLocaleString('pt-BR')}`, icon: CheckCircle2, color: 'blue' }
    ];
  }, [payables]);

  const reportData = useMemo(() => {
    const categories = {
      mao_de_obra: 0,
      material: 0,
      automacao: 0,
      projeto: 0
    };

    payables.forEach(p => {
      if (categories.hasOwnProperty(p.categoria)) {
        categories[p.categoria as keyof typeof categories] += p.valorTotal;
      }
    });

    const total = payables.reduce((acc, curr) => acc + curr.valorTotal, 0);

    return {
      categories,
      total,
      count: payables.length,
      paidCount: payables.filter(p => p.status === 'paga').length,
      pendingCount: payables.filter(p => p.status === 'aberta').length
    };
  }, [payables]);

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
      projetoNome: 'Geral / Administrativo'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 1cm;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Financeiro de Obras</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Controle rigoroso de pagamentos e fluxos de caixa.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowReportModal(true)}
             className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-gray-600 transition-all shadow-sm hover:bg-gray-50 dark:text-gray-300"
           >
             <Download size={20} /> Relatório
           </button>
           <button 
             onClick={() => setShowModal(true)}
             className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
           >
             <Plus size={20} /> Nova Conta
           </button>
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

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Extrato de Contas</h2>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setFilter('ativas')}
                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ativas' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}
                 >Ativas</button>
                 <button 
                   onClick={() => setFilter('pagas')}
                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'pagas' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}
                 >Pagas</button>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Vencimento</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Prestador / Obra</th>
                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {payables.filter(p => filter === 'ativas' ? p.status !== 'paga' : p.status === 'paga').map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group animate-in slide-in-from-left-2 duration-300">
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white tabular-nums">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(item.dataVencimento).toLocaleDateString('pt-BR')}
                     </div>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 dark:text-white">{item.prestadorNome}</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{item.projetoNome}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{item.descricao}</td>
                  <td className="px-8 py-5 text-right text-sm font-black text-gray-900 dark:text-white tabular-nums">
                    R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-5 text-center">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                       item.status === 'paga' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'paga' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                        {item.status}
                     </span>
                  </td>
                </tr>
              ))}
              {payables.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase text-xs">Nenhum lançamento financeiro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Relatório Financeiro */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto no-print">
          <div id="printable-report" className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8 overflow-hidden">
            <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between no-print">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
                     <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Relatório Financeiro de Obras</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dossiê Consolidado de Fluxo de Caixa</p>
                  </div>
               </div>
               <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-10">
               {/* Cabeçalho do Relatório Impresso */}
               <div className="hidden print:flex items-center justify-between border-b-2 border-gray-100 pb-8 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">PrecificaPro - Relatório de Obras</h1>
                        <p className="text-xs font-bold text-gray-500">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase text-gray-400">Status Geral</p>
                    <p className="text-lg font-black text-emerald-600">CONSOLIDADO</p>
                  </div>
               </div>

               {/* Grid de Resumo */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume Total</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">R$ {reportData.total.toLocaleString('pt-BR')}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-500">
                       <ArrowRight size={10} /> {reportData.count} lançamentos totais
                    </div>
                  </div>
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Liquidado</p>
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">R$ {payables.filter(p => p.status === 'paga').reduce((a, b) => a + b.valorTotal, 0).toLocaleString('pt-BR')}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                       <CheckCircle2 size={10} /> {reportData.paidCount} contas quitadas
                    </div>
                  </div>
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-800">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Total em Aberto</p>
                    <p className="text-2xl font-black text-amber-700 dark:text-amber-400">R$ {payables.filter(p => p.status === 'aberta').reduce((a, b) => a + b.valorTotal, 0).toLocaleString('pt-BR')}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-600">
                       <AlertCircle size={10} /> {reportData.pendingCount} provisões pendentes
                    </div>
                  </div>
               </div>

               {/* Analítico por Categoria */}
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <PieChart size={14} className="text-blue-500" /> Distribuição por Categoria
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                       { key: 'mao_de_obra', label: 'Mão de Obra', color: 'blue' },
                       { key: 'material', label: 'Materiais de Obra', color: 'amber' },
                       { key: 'automacao', label: 'Automação / Tecnologia', color: 'emerald' },
                       { key: 'projeto', label: 'Projetos / Consultoria', color: 'purple' }
                     ].map(item => {
                       const value = reportData.categories[item.key as keyof typeof reportData.categories];
                       const percent = reportData.total > 0 ? (value / reportData.total) * 100 : 0;
                       return (
                         <div key={item.key} className="p-5 border border-gray-100 dark:border-gray-800 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                               <p className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{item.label}</p>
                               <p className="text-xs font-black text-gray-900 dark:text-white">R$ {value.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full bg-${item.color}-500 transition-all duration-700`} 
                                 style={{ width: `${percent}%` }}
                               />
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 mt-2">{percent.toFixed(1)}% do volume total</p>
                         </div>
                       );
                     })}
                  </div>
               </div>

               {/* Detalhamento de Itens (Tabela compacta para impressão) */}
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detalhamento dos Lançamentos</h3>
                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                     <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50">
                           <tr>
                              <th className="px-4 py-3 font-black uppercase text-gray-400">Venc.</th>
                              <th className="px-4 py-3 font-black uppercase text-gray-400">Prestador</th>
                              <th className="px-4 py-3 font-black uppercase text-gray-400">Descrição</th>
                              <th className="px-4 py-3 font-black uppercase text-gray-400 text-right">Valor</th>
                              <th className="px-4 py-3 font-black uppercase text-gray-400 text-center">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {payables.map(p => (
                              <tr key={p.id}>
                                 <td className="px-4 py-2 font-bold">{new Date(p.dataVencimento).toLocaleDateString('pt-BR')}</td>
                                 <td className="px-4 py-2 font-bold">{p.prestadorNome}</td>
                                 <td className="px-4 py-2 text-gray-500">{p.descricao}</td>
                                 <td className="px-4 py-2 text-right font-black">R$ {p.valorTotal.toLocaleString('pt-BR')}</td>
                                 <td className="px-4 py-2 text-center uppercase font-black text-[8px]">{p.status}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Rodapé do Relatório */}
               <div className="pt-10 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-400 no-print">
                  <p>© 2024 PrecificaPro - Gestão Inteligente de Projetos</p>
                  <p>Documento gerado eletronicamente</p>
               </div>

               <div className="flex gap-4 pt-10 border-t border-gray-50 dark:border-gray-800 no-print">
                  <button onClick={() => setShowReportModal(false)} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2"><X size={16} /> Fechar</button>
                  <div className="flex-1"></div>
                  <button onClick={handlePrint} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 uppercase text-[10px]"><Printer size={16} /> Imprimir / PDF</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lançamento Financeiro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto no-print">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Lançar Nova Conta</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saída de Caixa / Provisão</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição da Despesa</label>
                <input 
                  required
                  type="text" 
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white" 
                  placeholder="Ex: Pagamento 1/3 Tubulação PVC" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor / Prestador</label>
                  <input 
                    required
                    type="text" 
                    value={formData.prestadorNome}
                    onChange={(e) => setFormData({...formData, prestadorNome: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white" 
                    placeholder="Ex: Leroy Merlin" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vincular à Obra</label>
                  <select 
                    value={formData.projetoNome}
                    onChange={(e) => setFormData({...formData, projetoNome: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                  >
                    <option value="Geral / Administrativo">Geral / Administrativo</option>
                    <option value="Apartamento Granja Viana">Apartamento Granja Viana</option>
                    <option value="Residência Alphaville">Residência Alphaville</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor Total (R$)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.valorTotal || ''}
                    onChange={(e) => setFormData({...formData, valorTotal: parseFloat(e.target.value) || 0})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data de Vencimento</label>
                  <input 
                    required
                    type="date" 
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria da Despesa</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'mao_de_obra', label: 'Mão de Obra' },
                    { id: 'material', label: 'Material' },
                    { id: 'automacao', label: 'Automação' },
                    { id: 'projeto', label: 'Projeto' }
                  ].map(cat => (
                    <button 
                      key={cat.id} 
                      type="button" 
                      onClick={() => setFormData({...formData, categoria: cat.id as any})}
                      className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                        formData.categoria === cat.id 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 hover:border-emerald-200'
                      }`}
                    >
                      <Tag size={14} /> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
