
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, FileText, Eye, Edit2, Trash2, Calendar, 
  DollarSign, Download, X, User, Briefcase, Tag, Trash, CheckCircle2 
} from 'lucide-react';

interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Proposal {
  id: string;
  client: string;
  company: string;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
  itemsCount: number;
}

const ProposalsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([
    { id: 'PRO-2024-001', client: 'João Silva', company: 'Condomínio Solar', total: 7200.00, status: 'sent', createdAt: '2024-01-15', itemsCount: 3 },
    { id: 'PRO-2024-002', client: 'Mauro Silva', company: 'Apartamento Granja Viana', total: 4500.50, status: 'approved', createdAt: '2024-01-10', itemsCount: 1 },
    { id: 'PRO-2024-003', client: 'Empresa Alfa', company: 'Tech Solutions', total: 12400.00, status: 'draft', createdAt: '2024-01-20', itemsCount: 5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Estados para Nova Proposta
  const [newProposal, setNewProposal] = useState({
    client: '',
    company: '',
    status: 'draft' as const,
    items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }] as ProposalItem[]
  });

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateTotal = (items: ProposalItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleAddItem = () => {
    setNewProposal({
      ...newProposal,
      items: [...newProposal.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleRemoveItem = (id: string) => {
    if (newProposal.items.length === 1) return;
    setNewProposal({
      ...newProposal,
      items: newProposal.items.filter(item => item.id !== id)
    });
  };

  const handleUpdateItem = (id: string, field: keyof ProposalItem, value: any) => {
    setNewProposal({
      ...newProposal,
      items: newProposal.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposal.client) return;

    const total = calculateTotal(newProposal.items);
    const createdProposal: Proposal = {
      id: `PRO-2024-${(proposals.length + 1).toString().padStart(3, '0')}`,
      client: newProposal.client,
      company: newProposal.company || 'Não informada',
      total: total,
      status: newProposal.status,
      createdAt: new Date().toISOString().split('T')[0],
      itemsCount: newProposal.items.length
    };

    setProposals([createdProposal, ...proposals]);
    setShowModal(false);
    setNewProposal({
      client: '',
      company: '',
      status: 'draft',
      items: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }]
    });
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
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Propostas Comerciais</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Histórico completo de orçamentos e propostas enviadas.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Nova Proposta</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente, empresa ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="draft">Rascunhos</option>
            <option value="sent">Enviadas</option>
            <option value="approved">Aprovadas</option>
            <option value="rejected">Recusadas</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Identificação</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente / Empresa</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Data</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Valor Total</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400 transition-colors">
                        <FileText size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{proposal.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-extrabold text-gray-900 dark:text-white">{proposal.client}</p>
                      <p className="text-xs text-gray-500 font-medium">{proposal.company}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Calendar size={14} />
                      {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
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
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all" title="Ver Detalhes"><Eye size={18} /></button>
                      <button className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-xl transition-all" title="Editar"><Edit2 size={18} /></button>
                      <button className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-all" title="Excluir"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Proposta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Nova Proposta Comercial</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preencha os dados do orçamento</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProposal} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={12} /> Cliente Responsável
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newProposal.client}
                      onChange={(e) => setNewProposal({...newProposal, client: e.target.value})}
                      placeholder="Nome do cliente"
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase size={12} /> Empresa / Projeto
                    </label>
                    <input 
                      type="text"
                      value={newProposal.company}
                      onChange={(e) => setNewProposal({...newProposal, company: e.target.value})}
                      placeholder="Nome da empresa ou obra"
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12} /> Status da Proposta
                    </label>
                    <select 
                      value={newProposal.status}
                      onChange={(e) => setNewProposal({...newProposal, status: e.target.value as any})}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="sent">Enviada ao Cliente</option>
                      <option value="approved">Aprovada</option>
                    </select>
                  </div>
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Valor Total Sugerido</p>
                      <h4 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                        R$ {calculateTotal(newProposal.items).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h4>
                    </div>
                    <DollarSign size={32} className="text-emerald-200" />
                  </div>
                </div>
              </div>

              {/* Itens da Proposta */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Itens do Orçamento</h3>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {newProposal.items.map((item, index) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 group relative">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Serviço / Produto</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Consultoria Técnica"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          className="w-full bg-transparent font-bold text-gray-900 dark:text-white outline-none placeholder:text-gray-300"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quant.</label>
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-center outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">V. Unit.</label>
                          <input 
                            type="number" 
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl font-bold text-center outline-none"
                          />
                        </div>
                        <div className="space-y-2 text-right">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</label>
                          <p className="py-2 text-sm font-black text-gray-900 dark:text-white">
                            R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {newProposal.items.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} /> Salvar Proposta Comercial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
