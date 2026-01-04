
import React, { useState } from 'react';
import { 
  Plus, Search, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Calendar, CheckCircle2, AlertCircle, Download, X, Tag
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
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'ativas' | 'pagas'>('ativas');

  const stats = [
    { label: 'Total a Pagar', value: 'R$ 12.500', icon: Wallet, color: 'emerald' },
    { label: 'Vencendo Hoje', value: 'R$ 0', icon: AlertCircle, color: 'rose' },
    { label: 'Pago este Mês', value: 'R$ 8.900', icon: CheckCircle2, color: 'blue' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Financeiro de Obras</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Controle rigoroso de pagamentos e fluxos de caixa.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-gray-600 transition-all shadow-sm">
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
                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === 'ativas' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-400'}`}
                 >Ativas</button>
                 <button 
                   onClick={() => setFilter('pagas')}
                   className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === 'pagas' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-400'}`}
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
              {payables.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white">
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
                  <td className="px-8 py-5 text-right text-sm font-black text-gray-900 dark:text-white">
                    R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-5 text-center">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                       item.status === 'paga' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'paga' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                        {item.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lançamento Financeiro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Lançar Nova Conta</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Descrição da Despesa</label>
                <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" placeholder="Ex: Pagamento 1/3 Tubulação PVC" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Valor Total (R$)</label>
                  <input type="number" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Data de Vencimento</label>
                  <input type="date" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Categoria</label>
                <div className="grid grid-cols-2 gap-2">
                  {['mao_de_obra', 'material', 'automacao', 'projeto'].map(cat => (
                    <button key={cat} type="button" className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500 hover:border-emerald-500 transition-all flex items-center gap-2">
                      <Tag size={12} /> {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  Confirmar Lançamento
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
