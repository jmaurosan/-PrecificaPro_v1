
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Search, FileText, Eye, Edit2, Trash2, Calendar, 
  DollarSign, Download, X, User, Briefcase, Tag, CheckCircle2,
  AlertTriangle, Receipt, AlignLeft, Printer, Hash, Building,
  Package, Wrench, Calculator as CalcIcon, Check, ArrowRight,
  ShoppingCart, ListPlus, Minus
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
      client: 'João Silva', 
      company: 'Condomínio Solar', 
      total: 7200.00, 
      status: 'sent', 
      createdAt: '2024-01-15', 
      itemsCount: 1,
      notes: 'Referente à automação das áreas comuns.',
      items: [
        { id: '1', description: 'Central de Automação Hub', unit: 'Pç', quantity: 1, unitPrice: 5000, category: 'product' },
        { id: '2', description: 'Instalação e Configuração', unit: 'Serv', quantity: 1, unitPrice: 2200, category: 'service' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [officeInfo, setOfficeInfo] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('precificaPro_company');
    if (stored) {
      setOfficeInfo(JSON.parse(stored));
    }

    const pending = localStorage.getItem('precificaPro_pending_proposal');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        handleOpenCreate(data);
        localStorage.removeItem('precificaPro_pending_proposal');
      } catch (e) {
        console.error("Erro ao carregar proposta pendente", e);
      }
    }
  }, []);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    proposalNumber: '',
    proposalDate: new Date().toISOString().split('T')[0],
    client: '',
    company: '',
    status: 'draft' as Proposal['status'],
    notes: '',
    items: [] as ProposalItem[]
  });

  // Estado para o Novo Item (Inserção Rápida)
  const [newItem, setNewItem] = useState<Partial<ProposalItem>>({
    description: '',
    unit: 'un',
    quantity: 1,
    unitPrice: 0,
    category: 'service'
  });

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => {
    const products = formData.items
      .filter(item => item.category === 'product')
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    const services = formData.items
      .filter(item => item.category === 'service')
      .reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    return {
      products,
      services,
      grandTotal: products + services
    };
  }, [formData.items]);

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.proposalNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = (prefillData?: any) => {
    setIsEditing(false);
    const nextNum = (proposals.length + 1).toString().padStart(3, '0');
    
    const items = prefillData?.items?.map((it: any) => ({
      ...it,
      id: it.id || Math.random().toString(36).substr(2, 9),
      category: it.category || 'service' 
    })) || [];

    setFormData({
      id: '',
      proposalNumber: `${new Date().getFullYear()}/${nextNum}`,
      proposalDate: new Date().toISOString().split('T')[0],
      client: '',
      company: '',
      status: 'draft',
      notes: prefillData?.notes || '',
      items: items
    });
    setEditingItemId(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (proposal: Proposal) => {
    setIsEditing(true);
    setFormData({
      id: proposal.id,
      proposalNumber: proposal.proposalNumber,
      proposalDate: proposal.proposalDate,
      client: proposal.client,
      company: proposal.company,
      status: proposal.status,
      notes: proposal.notes || '',
      items: [...proposal.items]
    });
    setEditingItemId(null);
    setShowFormModal(true);
  };

  const handleOpenView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowViewModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta proposta?')) {
      setProposals(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleQuickAdd = () => {
    if (!newItem.description || (newItem.unitPrice || 0) <= 0) {
      alert("Por favor, preencha a descrição e o valor unitário.");
      return;
    }

    if (editingItemId) {
      // Atualizar item existente
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === editingItemId 
          ? { ...item, ...newItem as ProposalItem } 
          : item
        )
      }));
      setEditingItemId(null);
    } else {
      // Adicionar novo item
      const itemToAdd: ProposalItem = {
        id: Math.random().toString(36).substr(2, 9),
        description: newItem.description || '',
        unit: newItem.unit || 'un',
        quantity: newItem.quantity || 1,
        unitPrice: newItem.unitPrice || 0,
        category: newItem.category as any || 'service'
      };

      setFormData(prev => ({
        ...prev,
        items: [...prev.items, itemToAdd]
      }));
    }

    // Resetar formulário de inserção rápida
    setNewItem({
      description: '',
      unit: 'un',
      quantity: 1,
      unitPrice: 0,
      category: newItem.category
    });

    // Devolver o foco para a descrição
    descriptionRef.current?.focus();
  };

  const handleStartEditItem = (item: ProposalItem) => {
    setNewItem({
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      category: item.category
    });
    setEditingItemId(item.id);
    descriptionRef.current?.focus();
  };

  const handleRemoveItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
    if (editingItemId === id) setEditingItemId(null);
  };

  const adjustQuantity = (amount: number) => {
    const current = newItem.quantity || 0;
    const next = Math.max(1, current + amount);
    setNewItem({ ...newItem, quantity: next });
  };

  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Adicione pelo menos um item à proposta.");
      return;
    }

    const total = totals.grandTotal;

    if (isEditing) {
      setProposals(proposals.map(p => p.id === formData.id ? {
        ...p,
        proposalNumber: formData.proposalNumber,
        proposalDate: formData.proposalDate,
        client: formData.client,
        company: formData.company,
        status: formData.status,
        notes: formData.notes,
        items: formData.items,
        total: total,
        itemsCount: formData.items.length
      } : p));
    } else {
      const createdProposal: Proposal = {
        id: `PRO-${Date.now()}`,
        proposalNumber: formData.proposalNumber,
        proposalDate: formData.proposalDate,
        client: formData.client,
        company: formData.company || 'Não informada',
        total: total,
        status: formData.status,
        notes: formData.notes,
        createdAt: new Date().toISOString().split('T')[0],
        itemsCount: formData.items.length,
        items: formData.items
      };
      setProposals([createdProposal, ...proposals]);
    }

    setShowFormModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'sent': return 'Enviada';
      case 'rejected': return 'Recusada';
      default: return 'Rascunho';
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-proposal, #printable-proposal * { visibility: visible; }
          #printable-proposal { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 1.5cm;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Propostas Comerciais</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Gerenciamento de orçamentos com identidade visual do seu escritório.</p>
        </div>
        <button 
          onClick={() => handleOpenCreate()}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Nova Proposta</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente, número da proposta ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all shadow-sm font-bold"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="draft">Rascunhos</option>
            <option value="sent">Enviadas</option>
            <option value="approved">Aprovadas</option>
            <option value="rejected">Recusadas</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nº Proposta</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente / Empresa</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Data</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Valor Total</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400 transition-colors">
                        <Hash size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{proposal.proposalNumber}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-extrabold text-gray-900 dark:text-white">{proposal.client}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{proposal.company}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Calendar size={14} />
                      {new Date(proposal.proposalDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-sm text-gray-900 dark:text-white">
                    R$ {proposal.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(proposal.status)}`}>
                      {getStatusLabel(proposal.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenView(proposal)} className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><Eye size={18} /></button>
                      <button onClick={() => handleOpenEdit(proposal)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(proposal.id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto no-print">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-5xl shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${isEditing ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'} dark:bg-opacity-10 rounded-2xl flex items-center justify-center`}>
                  {isEditing ? <Edit2 size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {isEditing ? 'Editar Proposta' : 'Nova Proposta Comercial'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalhamento Financeiro e Escopo</p>
                </div>
              </div>
              <button onClick={() => setShowFormModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveProposal} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash size={12} /> Número</label>
                  <input type="text" required value={formData.proposalNumber} onChange={(e) => setFormData({...formData, proposalNumber: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Data</label>
                  <input type="date" required value={formData.proposalDate} onChange={(e) => setFormData({...formData, proposalDate: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Tag size={12} /> Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white">
                    <option value="draft">Rascunho</option>
                    <option value="sent">Enviada</option>
                    <option value="approved">Aprovada</option>
                    <option value="rejected">Recusada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><User size={12} /> Cliente</label>
                    <input type="text" required value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500" placeholder="Nome do Cliente" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={12} /> Empresa / Projeto</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500" placeholder="Ex: Residência Granja Viana" />
                  </div>
                </div>
                
                <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-600/20 flex flex-col justify-center">
                   <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                         <CalcIcon size={24} />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Valor Total da Proposta</p>
                         <h3 className="text-3xl font-black">R$ {totals.grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-xs font-bold opacity-90 border-t border-white/20 pt-4">
                      <p>📦 Prod: R$ {totals.products.toLocaleString('pt-BR')}</p>
                      <p>🛠️ Serv: R$ {totals.services.toLocaleString('pt-BR')}</p>
                   </div>
                </div>
              </div>

              {/* COMPONENTE: INSERÇÃO RÁPIDA DE ITENS ATUALIZADO */}
              <div className={`rounded-[32px] p-8 border mb-8 transition-all duration-300 ${editingItemId ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    {editingItemId ? <Edit2 size={18} className="text-blue-500" /> : <ListPlus size={18} className="text-emerald-500" />}
                    {editingItemId ? 'Editando Item' : 'Adição Rápida de Itens'}
                  </h3>
                  {editingItemId && (
                    <button type="button" onClick={() => { setEditingItemId(null); setNewItem({ description: '', unit: 'un', quantity: 1, unitPrice: 0, category: newItem.category }); }} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Cancelar Edição</button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</label>
                    <input 
                      ref={descriptionRef}
                      type="text" 
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      placeholder="Ex: Sensor de Presença Zigbee"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
                      <button 
                        type="button" 
                        onClick={() => setNewItem({...newItem, category: 'product'})}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${newItem.category === 'product' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400'}`}
                      >
                        <Package size={12} /> Prod
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setNewItem({...newItem, category: 'service'})}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${newItem.category === 'service' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400'}`}
                      >
                        <Wrench size={12} /> Serv
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade / Unidade</label>
                    <div className="flex items-center gap-2">
                       <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                          <button type="button" onClick={() => adjustQuantity(-1)} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 transition-colors border-r border-gray-100 dark:border-gray-700"><Minus size={14}/></button>
                          <input 
                            type="number" 
                            step="0.01"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                            className="w-14 bg-transparent font-bold text-center outline-none text-sm"
                          />
                          <button type="button" onClick={() => adjustQuantity(1)} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 transition-colors border-l border-gray-100 dark:border-gray-700"><Plus size={14}/></button>
                       </div>
                       <input 
                          type="text" 
                          value={newItem.unit}
                          onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                          className="w-14 px-2 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-center outline-none text-sm"
                          placeholder="Un"
                        />
                    </div>
                  </div>

                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">V. Unit (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={newItem.unitPrice || ''}
                      onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-center outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button 
                      type="button" 
                      onClick={handleQuickAdd}
                      className={`w-full h-[46px] rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${editingItemId ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-emerald-600 text-white shadow-emerald-600/20'}`}
                    >
                      {editingItemId ? <Check size={16} /> : <Plus size={16} />}
                      {editingItemId ? 'Salvar Edição' : 'Adicionar Item'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="px-2">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Receipt size={16} className="text-emerald-500" /> Itens na Proposta
                  </h3>
                </div>

                <div className="overflow-hidden rounded-[32px] border border-gray-100 dark:border-gray-800">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/30">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cat.</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quant.</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Unitário</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {formData.items.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nenhum item adicionado à proposta. Use o formulário acima.</td>
                        </tr>
                      ) : (
                        formData.items.map((item) => (
                          <tr key={item.id} className={`transition-all duration-300 ${editingItemId === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20 animate-in slide-in-from-top-2 duration-300'}`}>
                            <td className="px-6 py-4 font-bold text-sm text-gray-900 dark:text-white">{item.description}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${item.category === 'product' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {item.category === 'product' ? <Package size={10}/> : <Wrench size={10}/>}
                                {item.category === 'product' ? 'Prod' : 'Serv'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-xs font-bold text-gray-500 tabular-nums">{item.quantity} {item.unit}</td>
                            <td className="px-6 py-4 text-right text-xs font-bold text-gray-500 tabular-nums">R$ {item.unitPrice.toLocaleString('pt-BR')}</td>
                            <td className="px-6 py-4 text-right font-black text-sm text-gray-900 dark:text-white tabular-nums">R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button type="button" onClick={() => handleStartEditItem(item)} className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"><Edit2 size={16} /></button>
                                <button type="button" onClick={() => handleRemoveItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 mb-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><AlignLeft size={12} /> Observações Gerais</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Ex: Prazo de entrega de 15 dias úteis. Pagamento em 3x no boleto..." className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl font-bold outline-none text-gray-900 dark:text-white resize-none h-24 text-sm focus:border-emerald-500" />
              </div>

              <div className="flex gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
                <button type="button" onClick={() => setShowFormModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px]">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"><CheckCircle2 size={18} /> {isEditing ? 'Salvar Alterações' : 'Finalizar Proposta'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 backdrop-blur-lg animate-in fade-in duration-300 overflow-y-auto">
          <div id="printable-proposal" className="bg-white dark:bg-gray-900 rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-10 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex flex-col md:flex-row items-center gap-6">
                 {officeInfo?.logo ? <img src={officeInfo.logo} alt="Logo" className="w-24 h-24 object-contain" /> : <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-gray-300"><Building size={40} /></div>}
                 <div className="text-center md:text-left">
                   <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{officeInfo?.name || 'Seu Escritório'}</h2>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest space-y-0.5">
                     <p>{officeInfo?.email}</p>
                     <p>{officeInfo?.phone}</p>
                   </div>
                 </div>
               </div>
               <div className="text-right flex flex-col items-center md:items-end gap-2">
                  <div className="px-5 py-3 bg-emerald-600 text-white rounded-2xl">
                     <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Proposta Comercial</p>
                     <p className="text-xl font-black">{selectedProposal.proposalNumber}</p>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Emitida em: {new Date(selectedProposal.proposalDate).toLocaleDateString('pt-BR')}</p>
               </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-1">Destinatário</h3>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Cliente</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{selectedProposal.client}</p>
                    <p className="text-sm font-bold text-gray-500 uppercase">{selectedProposal.company}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-[32px] flex flex-col justify-center text-center">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Investimento Total</p>
                   <p className="text-4xl font-black text-emerald-600">R$ {selectedProposal.total.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-1"><Receipt size={14} className="text-emerald-500" /> Descritivo de Itens</h3>
                <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Item</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Cat.</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">Quant</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">V. Unit</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {selectedProposal.items.map((item) => (
                        <tr key={item.id} className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          <td className="px-6 py-4">{item.description}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase ${item.category === 'product' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                               {item.category === 'product' ? 'PROD' : 'SERV'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">{item.quantity} {item.unit}</td>
                          <td className="px-6 py-4 text-right">R$ {item.unitPrice.toLocaleString('pt-BR')}</td>
                          <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-emerald-50 dark:bg-emerald-900/10">
                      <tr className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">
                        <td colSpan={4} className="px-6 py-3 text-right">Total de Produtos</td>
                        <td className="px-6 py-3 text-right">R$ {selectedProposal.items.filter(i => i.category === 'product').reduce((s, i) => s + (i.quantity * i.unitPrice), 0).toLocaleString('pt-BR')}</td>
                      </tr>
                      <tr className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">
                        <td colSpan={4} className="px-6 py-3 text-right">Total de Serviços</td>
                        <td className="px-6 py-3 text-right">R$ {selectedProposal.items.filter(i => i.category === 'service').reduce((s, i) => s + (i.quantity * i.unitPrice), 0).toLocaleString('pt-BR')}</td>
                      </tr>
                      <tr className="text-xs font-black uppercase text-white bg-emerald-600">
                        <td colSpan={4} className="px-6 py-4 text-right">Total Geral da Proposta</td>
                        <td className="px-6 py-4 text-right">R$ {selectedProposal.total.toLocaleString('pt-BR')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {selectedProposal.notes && (
                <div className="p-8 bg-gray-50 dark:bg-gray-800/40 rounded-[32px] border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><AlignLeft size={14} className="text-emerald-500" /> Notas e Observações</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">{selectedProposal.notes}</p>
                </div>
              )}

              <div className="flex gap-4 pt-10 border-t border-gray-50 dark:border-gray-800 no-print">
                <button onClick={() => setShowViewModal(false)} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2"><X size={16} /> Fechar</button>
                <div className="flex-1"></div>
                <button onClick={() => { setShowViewModal(false); handleOpenEdit(selectedProposal); }} className="px-6 py-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2"><Edit2 size={16} /> Editar</button>
                <button onClick={handlePrint} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 uppercase text-[10px]"><Printer size={16} /> Imprimir / PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
