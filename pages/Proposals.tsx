
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Search, FileText, Eye, Edit2, Trash2, Calendar, 
  DollarSign, Download, X, User, Briefcase, Tag, CheckCircle2,
  AlertTriangle, Receipt, AlignLeft, Printer, Hash, Building,
  Package, Wrench, Calculator as CalcIcon, Check, ArrowRight,
  ShoppingCart, ListPlus, Minus, Hammer,
  // Add missing icon
  ChevronRight
} from 'lucide-react';
import { CompanyProfile } from '../types';

interface ProposalItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  category: 'product' | 'service';
}

interface Proposal {
  id: string;
  proposalNumber: string;
  proposalDate: string;
  client: string;
  company: string;
  projetoNome: string; // Vínculo com Projeto
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
  itemsCount: number;
  items: ProposalItem[];
  notes?: string;
}

const ProposalsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([
    { 
      id: 'PRO-2024-001', 
      proposalNumber: '2024/001',
      proposalDate: '2024-01-15',
      client: 'Mauro Silva', 
      company: 'Individual',
      projetoNome: 'Apartamento Granja Viana',
      total: 7200.00, 
      status: 'approved', 
      createdAt: '2024-01-15', 
      itemsCount: 1,
      items: [
        { id: '1', description: 'Instalação e Configuração', unit: 'Serv', quantity: 1, unitPrice: 7200, category: 'service' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    proposalNumber: '',
    proposalDate: new Date().toISOString().split('T')[0],
    client: '',
    projetoNome: 'Apartamento Granja Viana',
    status: 'draft',
    items: []
  });

  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const createdProposal: Proposal = {
      id: `PRO-${Date.now()}`,
      ...formData,
      total: formData.items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0),
      createdAt: new Date().toISOString().split('T')[0],
      itemsCount: formData.items.length
    };
    setProposals([createdProposal, ...proposals]);
    setShowFormModal(false);
  };

  const filteredProposals = proposals.filter(p => 
    p.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.projetoNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Propostas Comerciais</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Orçamentos detalhados vinculados a cada frente de trabalho.</p>
        </div>
        <button 
          onClick={() => setShowFormModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Nova Proposta</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por cliente ou obra..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white font-bold shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all relative group">
             <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                   {p.status}
                </span>
                <p className="text-[10px] font-bold text-gray-400 tabular-nums">#{p.proposalNumber}</p>
             </div>
             
             <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2">{p.client}</h3>
             <div className="flex items-center gap-2 mb-8">
                <Hammer size={12} className="text-indigo-600" />
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.projetoNome}</p>
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor da Proposta</p>
                   <p className="text-xl font-black text-gray-900 dark:text-white">R$ {p.total.toLocaleString('pt-BR')}</p>
                </div>
                <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                   <ChevronRight size={20} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between shrink-0">
               <h2 className="text-2xl font-black text-gray-900 dark:text-white">Nova Proposta Comercial</h2>
               <button onClick={() => setShowFormModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               <form id="proposal-form" onSubmit={handleSaveProposal} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">1. Vincular à Obra / Projeto</label>
                    <select required value={formData.projetoNome} onChange={(e) => setFormData({...formData, projetoNome: e.target.value})} className="w-full px-5 py-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl font-black text-indigo-600 dark:text-indigo-400 outline-none">
                      <option value="Apartamento Granja Viana">Apartamento Granja Viana</option>
                      <option value="Residência Alphaville">Residência Alphaville</option>
                      <option value="Loja Shopping Center">Loja Shopping Center</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nº Proposta</label>
                        <input type="text" required value={formData.proposalNumber} onChange={(e) => setFormData({...formData, proposalNumber: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold" placeholder="2024/005" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</label>
                        <input type="text" required value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold" />
                     </div>
                  </div>
                  <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-800">
                     <p className="text-sm font-bold text-blue-700 dark:text-blue-300 italic text-center">
                        Ao aprovar esta proposta, o valor total será somado ao orçamento disponível da obra vinculada.
                     </p>
                  </div>
               </form>
            </div>
            <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex gap-4 shrink-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-[40px]">
              <button onClick={() => setShowFormModal(false)} className="flex-1 py-4 bg-white dark:bg-gray-800 text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-gray-100 dark:border-gray-700">Cancelar</button>
              <button form="proposal-form" type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                  Salvar Proposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
