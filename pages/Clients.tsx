
import React, { useState } from 'react';
import { 
  Plus, Search, Mail, Phone, Building, Edit2, Trash2, MapPin, 
  ExternalLink, Users, Hash, FileText, Layout, Home, 
  UserCheck, CreditCard, Calendar, ChevronRight, 
  CheckCircle2, Briefcase, Ruler, X, Info, Target, Palette, AlignLeft,
  Clock, Sparkles, User as UserIcon, ShieldCheck, Fingerprint, CalendarDays
} from 'lucide-react';
import { Client, TipoPessoa, TipoImovel, StatusLead } from '../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    { 
      id: '1', 
      tipo: 'PF',
      nome: 'João Silva', 
      cpfCnpj: '123.456.789-00',
      email: 'joao@email.com', 
      telefones: { celular: '(11) 99999-9999', whatsapp: '(11) 99999-9999' },
      imovel: {
        tipo: 'casa',
        endereco: { logradouro: 'Alameda das Palmeiras', numero: '88', bairro: 'Granja Viana', cidade: 'Cotia', uf: 'SP', cep: '06700-000', quadra: 'B', lote: '15' },
        situacaoPosse: 'proprietario',
        metragemM2: 280,
        condominio: { nome: 'Residencial Solar' }
      },
      status: 'contratado',
      createdAt: new Date('2024-01-05')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDossieModal, setShowDossieModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'id' | 'property' | 'briefing' | 'review'>('id');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const initialFormState: Partial<Client> = {
    tipo: 'PF',
    nome: '',
    fantasia: '',
    inscricaoEstadual: '',
    nascimento: '',
    cpfCnpj: '',
    email: '',
    telefones: { celular: '', whatsapp: '' },
    imovel: {
      tipo: 'apartamento',
      metragemM2: 0,
      situacaoPosse: 'proprietario',
      endereco: { logradouro: '', numero: '', bairro: '', cidade: '', uf: '', cep: '' },
      condominio: { nome: '' }
    },
    briefing: {
      objetivo: '',
      estilo: '',
      prazo: 'curto'
    },
    status: 'novo'
  };

  const [formData, setFormData] = useState<any>(initialFormState);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData(initialFormState);
    setActiveTab('id');
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingClient(client);
    setFormData(client);
    setActiveTab('id');
    setShowModal(true);
  };

  const handleOpenDossie = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedClient(client);
    setShowDossieModal(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm("Deseja realmente remover este cliente?")) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email) {
      alert("Nome e Email são campos obrigatórios na aba de Identificação.");
      setActiveTab('id');
      return;
    }

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } as Client : c));
    } else {
      const newClient: Client = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date()
      } as Client;
      setClients([newClient, ...clients]);
    }
    setShowModal(false);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpfCnpj.includes(searchTerm)
  );

  const getStatusStyle = (status: StatusLead) => {
    switch (status) {
      case 'contratado': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'em_briefing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'novo': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'perdido': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Gestão de Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Controle de leads, briefing e histórico de contratos.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Cliente / Lead</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 dark:text-white transition-all shadow-sm font-bold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div 
            key={client.id} 
            onClick={() => handleOpenEdit(client)}
            className="group bg-white dark:bg-gray-900 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all flex flex-col cursor-pointer relative"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 transition-all ${client.status === 'contratado' ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  {client.tipo === 'PF' ? <Users size={24} /> : <Building size={24} />}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight truncate">{client.nome}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1 ${getStatusStyle(client.status)}`}>
                    {client.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={(e) => handleOpenEdit(client, e)} 
                  className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={(e) => handleDelete(client.id, e)} 
                  className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-rose-500 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                <CreditCard size={14} className="text-indigo-500" /> {client.cpfCnpj}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                <Mail size={14} className="text-indigo-500" /> {client.email}
              </div>
              <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-[24px] space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                       <Home size={12} className="text-indigo-500" /> {client.imovel.tipo}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md uppercase">
                       {client.imovel.metragemM2}m²
                    </span>
                 </div>
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1 flex items-center gap-2">
                    <MapPin size={12} className="text-gray-400" />
                    {client.imovel.endereco.logradouro}, {client.imovel.endereco.numero}
                 </p>
              </div>
            </div>

            <button 
              onClick={(e) => handleOpenDossie(client, e)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Acessar Dossiê Digital <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal Cadastro de Cliente (Tabs) */}
      {showModal && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8 flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                        {editingClient ? 'Atualizar Dossiê' : 'Cadastrar Novo Cliente'}
                      </h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preencha as informações técnicas nas abas abaixo</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-all shadow-sm">
                      <X size={24} />
                    </button>
                  </div>
                  
                  {/* Navegação por Abas */}
                  <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-3xl w-fit">
                    {[
                      { id: 'id', label: 'Identificação', icon: UserIcon },
                      { id: 'property', label: 'Imóvel & Obra', icon: Home },
                      { id: 'briefing', label: 'Briefing Técnico', icon: Sparkles },
                      { id: 'review', label: 'Revisão Final', icon: ShieldCheck },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isActive 
                              ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' 
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                          }`}
                        >
                          <Icon size={14} /> {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-8 overflow-y-auto no-scrollbar flex-1">
                   {activeTab === 'id' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Pessoa</label>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => setFormData({...formData, tipo: 'PF'})}
                                  className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border flex items-center justify-center gap-2 ${formData.tipo === 'PF' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800'}`}
                                >
                                  <UserIcon size={16} /> Pessoa Física
                                </button>
                                <button 
                                  onClick={() => setFormData({...formData, tipo: 'PJ'})}
                                  className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border flex items-center justify-center gap-2 ${formData.tipo === 'PJ' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800'}`}
                                >
                                  <Building size={16} /> Pessoa Jurídica
                                </button>
                             </div>
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               {formData.tipo === 'PF' ? 'Nome Completo' : 'Razão Social'}
                             </label>
                             <input 
                                type="text" 
                                value={formData.nome}
                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:border-indigo-500 font-bold outline-none text-gray-900 dark:text-white" 
                                placeholder={formData.tipo === 'PF' ? 'Ex: João Silva' : 'Ex: Tecnologia LTDA'} 
                             />
                           </div>
                        </div>

                        {/* Campos específicos PJ */}
                        {formData.tipo === 'PJ' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome Fantasia</label>
                              <input 
                                type="text" 
                                value={formData.fantasia}
                                onChange={(e) => setFormData({...formData, fantasia: e.target.value})}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inscrição Estadual</label>
                              <input 
                                type="text" 
                                value={formData.inscricaoEstadual}
                                onChange={(e) => setFormData({...formData, inscricaoEstadual: e.target.value})}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                              />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               {formData.tipo === 'PF' ? 'CPF' : 'CNPJ'}
                             </label>
                             <input 
                                type="text" 
                                value={formData.cpfCnpj}
                                onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                             />
                           </div>
                           
                           {formData.tipo === 'PF' ? (
                             <div className="space-y-3 animate-in fade-in duration-300">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data de Nascimento</label>
                               <div className="relative">
                                 <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input 
                                  type="date" 
                                  value={formData.nascimento}
                                  onChange={(e) => setFormData({...formData, nascimento: e.target.value})}
                                  className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                                 />
                               </div>
                             </div>
                           ) : (
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Comercial</label>
                                <select 
                                  value={formData.status}
                                  onChange={(e) => setFormData({...formData, status: e.target.value as StatusLead})}
                                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                >
                                  <option value="novo">Lead Novo</option>
                                  <option value="em_briefing">Em Briefing</option>
                                  <option value="contratado">Contratado</option>
                                </select>
                              </div>
                           )}

                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</label>
                             <input 
                                type="tel" 
                                value={formData.telefones?.celular}
                                onChange={(e) => setFormData({...formData, telefones: { ...formData.telefones!, celular: e.target.value, whatsapp: e.target.value }})}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                             />
                           </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail Principal</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                          />
                        </div>
                     </div>
                   )}

                   {activeTab === 'property' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Imóvel</label>
                             <select 
                                value={formData.imovel?.tipo}
                                onChange={(e) => setFormData({...formData, imovel: { ...formData.imovel!, tipo: e.target.value as TipoImovel }})}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                             >
                                <option value="apartamento">Apartamento</option>
                                <option value="casa">Casa</option>
                                <option value="comercial">Comercial</option>
                                <option value="terreno">Terreno</option>
                             </select>
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Área Estimada (m²)</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={formData.imovel?.metragemM2}
                                 onChange={(e) => setFormData({...formData, imovel: { ...formData.imovel!, metragemM2: parseFloat(e.target.value) || 0 }})}
                                 className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" 
                               />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-indigo-500 uppercase">m²</span>
                             </div>
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Condomínio (Opcional)</label>
                             <input type="text" value={formData.imovel?.condominio?.nome} onChange={(e) => setFormData({...formData, imovel: {...formData.imovel!, condominio: {nome: e.target.value}}})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                           <div className="md:col-span-3 space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logradouro / Rua</label>
                             <input type="text" value={formData.imovel?.endereco?.logradouro} onChange={(e) => setFormData({...formData, imovel: {...formData.imovel!, endereco: {...formData.imovel!.endereco, logradouro: e.target.value}}})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" />
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nº / Quadra</label>
                             <input type="text" value={formData.imovel?.endereco?.numero} onChange={(e) => setFormData({...formData, imovel: {...formData.imovel!, endereco: {...formData.imovel!.endereco, numero: e.target.value}}})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" />
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'briefing' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[32px] border border-indigo-100 dark:border-indigo-800 flex items-start gap-5">
                           <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                              <Sparkles size={24} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Objetivo da Obra</h4>
                              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">Defina os desejos do cliente para alimentar a calculadora de orçamento de forma inteligente.</p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><AlignLeft size={12} className="text-indigo-500" /> Descrição da Necessidade</label>
                           <textarea 
                              value={formData.briefing?.objetivo}
                              onChange={(e) => setFormData({...formData, briefing: {...formData.briefing, objetivo: e.target.value}})}
                              placeholder="Ex: Reforma de interiores focada em integração de ambientes e automação de iluminação..." 
                              className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] font-bold outline-none text-gray-900 dark:text-white resize-none h-40 focus:border-indigo-500" 
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Palette size={12} className="text-indigo-500" /> Estilo / Referências</label>
                              <input type="text" value={formData.briefing?.estilo} onChange={(e) => setFormData({...formData, briefing: {...formData.briefing, estilo: e.target.value}})} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} className="text-indigo-500" /> Expectativa de Prazo</label>
                              <select 
                                 value={formData.briefing?.prazo}
                                 onChange={(e) => setFormData({...formData, briefing: {...formData.briefing, prazo: e.target.value}})}
                                 className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                              >
                                 <option value="curto">Imediato (Urgente)</option>
                                 <option value="medio">Planejado (3-6 meses)</option>
                                 <option value="longo">Futuro (Acima de 1 ano)</option>
                              </select>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'review' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800">
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2"><UserCheck size={14}/> Dados do Cliente</p>
                              <h4 className="text-xl font-black text-gray-900 dark:text-white">{formData.nome || 'Nome não informado'}</h4>
                              {formData.tipo === 'PJ' && formData.fantasia && (
                                <p className="text-xs font-bold text-gray-400 uppercase mt-1">Nome Fantasia: {formData.fantasia}</p>
                              )}
                              <p className="text-sm text-gray-500 mt-2 font-bold">{formData.email}</p>
                              <p className="text-sm text-gray-500 font-bold">{formData.telefones?.celular}</p>
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{formData.tipo === 'PF' ? 'CPF' : 'CNPJ'}</span>
                                    <span className="text-xs font-bold">{formData.cpfCnpj || '---'}</span>
                                 </div>
                                 {formData.tipo === 'PF' && formData.nascimento && (
                                   <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black text-gray-400 uppercase">Nascimento</span>
                                      <span className="text-xs font-bold">{new Date(formData.nascimento).toLocaleDateString('pt-BR')}</span>
                                   </div>
                                 )}
                              </div>
                           </div>
                           <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800">
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2"><Home size={14}/> Dados do Imóvel</p>
                              <h4 className="text-lg font-black text-gray-900 dark:text-white capitalize">{formData.imovel?.tipo}</h4>
                              <p className="text-sm text-gray-500 font-bold">{formData.imovel?.metragemM2} m²</p>
                              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{formData.imovel?.endereco?.logradouro}, {formData.imovel?.endereco?.numero}</p>
                           </div>
                        </div>
                        <div className="p-8 bg-indigo-600 rounded-[32px] text-white shadow-xl shadow-indigo-600/20">
                           <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2"><FileText size={14}/> Resumo do Briefing</h4>
                           <p className="text-sm font-medium leading-relaxed italic">"{formData.briefing?.objetivo || 'Sem descritivo técnico.'}"</p>
                        </div>
                     </div>
                   )}
                </div>

                <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-8 py-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
                  >
                    Descartar Rascunho
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] active:scale-95"
                  >
                    <CheckCircle2 size={18} /> {editingClient ? 'Atualizar Dossiê' : 'Finalizar Cadastro'}
                  </button>
                </div>
            </div>
         </div>
      )}

      {/* Modal Dossiê Digital Completo (Visualização) */}
      {showDossieModal && selectedClient && (
        <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-950 rounded-[48px] w-full max-w-5xl shadow-2xl my-8 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col">
            
            {/* Header Dossiê */}
            <div className="p-10 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                    <UserCheck size={36} />
                 </div>
                 <div className="text-center md:text-left">
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedClient.nome}</h2>
                   <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(selectedClient.status)}`}>
                        {selectedClient.status.replace('_', ' ')}
                     </span>
                     <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {selectedClient.tipo} | ID: {selectedClient.id}
                     </span>
                   </div>
                 </div>
               </div>
               <div className="flex gap-3">
                  <button className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-indigo-600 transition-all shadow-sm">
                    <FileText size={22} />
                  </button>
                  <button onClick={() => setShowDossieModal(false)} className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all shadow-xl">
                    <X size={22} />
                  </button>
               </div>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              <div className="space-y-8">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Fingerprint size={14} className="text-indigo-500" /> Dados de {selectedClient.tipo === 'PF' ? 'Identidade' : 'Empresa'}
                    </h4>
                    <div className="space-y-4">
                       <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-transparent">
                          <p className="text-[9px] font-black text-gray-400 uppercase">{selectedClient.tipo === 'PF' ? 'CPF' : 'CNPJ'}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedClient.cpfCnpj}</p>
                       </div>
                       {selectedClient.tipo === 'PF' && selectedClient.nascimento && (
                         <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-transparent">
                            <p className="text-[9px] font-black text-gray-400 uppercase">Nascimento</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(selectedClient.nascimento).toLocaleDateString('pt-BR')}</p>
                         </div>
                       )}
                       {selectedClient.tipo === 'PJ' && selectedClient.fantasia && (
                         <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-transparent">
                            <p className="text-[9px] font-black text-gray-400 uppercase">Nome Fantasia</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedClient.fantasia}</p>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Briefcase size={14} className="text-indigo-500" /> Canais de Contato
                    </h4>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
                          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                             <Mail size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[9px] font-black text-gray-400 uppercase">E-mail</p>
                             <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{selectedClient.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
                          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                             <Phone size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[9px] font-black text-gray-400 uppercase">WhatsApp</p>
                             <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{selectedClient.telefones.celular}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-10">
                 <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                       <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                          <Home size={18} className="text-indigo-500" /> Dossiê do Imóvel & Localização
                       </h3>
                       <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full text-[9px] font-black text-gray-400 uppercase">{selectedClient.imovel.situacaoPosse}</span>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Endereço Técnico da Obra</p>
                             <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">
                                {selectedClient.imovel.endereco.logradouro}, {selectedClient.imovel.endereco.numero}<br/>
                                {selectedClient.imovel.endereco.bairro} - {selectedClient.imovel.endereco.cidade}/{selectedClient.imovel.endereco.uf}
                             </p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
                             <Ruler size={20} className="mx-auto text-indigo-500 mb-2" />
                             <p className="text-[8px] font-black text-gray-400 uppercase">Metragem</p>
                             <p className="text-lg font-black text-gray-900 dark:text-white">{selectedClient.imovel.metragemM2}m²</p>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center">
                             <Target size={20} className="mx-auto text-indigo-500 mb-2" />
                             <p className="text-[8px] font-black text-gray-400 uppercase">Tipo</p>
                             <p className="text-lg font-black text-gray-900 dark:text-white capitalize">{selectedClient.imovel.tipo}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
