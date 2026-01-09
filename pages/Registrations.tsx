
import React, { useState } from 'react';
import { 
  Users, HardHat, Building2, Search, Plus, Filter, 
  ExternalLink, Mail, Phone, Home, Star, Cpu, Zap,
  ChevronRight, CreditCard, CheckCircle2, X, MapPin, Hash,
  Tag, Package, Globe, User as UserIcon, ShoppingBag, ArrowRight,
  MessageCircle, Info, Bookmark, Edit2, Trash2
} from 'lucide-react';
import ClientsPage from './Clients';
import Providers from './Providers';

type TabType = 'clients' | 'providers' | 'suppliers';

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  category: string;
  marcas: string[];
  email: string;
  fone: string;
  website?: string;
}

const Registrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clients');

  // Estado para Fornecedores
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 's1', name: 'Distribuidora Luz & Som', contactName: 'Ricardo Oliveira', category: 'Materiais Elétricos', marcas: ['Savant', 'Sonos', 'Lutron', 'Control4'], email: 'vendas@luzsom.com.br', fone: '(11) 98888-7777', website: 'www.luzesomdistribuidora.com.br' },
    { id: 's2', name: 'Mármores Granito S.A', contactName: 'Ana Clara', category: 'Pedras e Revestimentos', marcas: ['Dekton', 'Silestone', 'Sensa'], email: 'comercial@granitosa.com', fone: '(11) 3333-2222', website: 'www.granitosa.com.br' }
  ]);

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [supplierFormData, setSupplierFormData] = useState<Partial<Supplier>>({
    name: '',
    contactName: '',
    category: 'Materiais Elétricos',
    marcas: [],
    email: '',
    fone: '',
    website: ''
  });

  const handleOpenCreateSupplier = () => {
    setIsEditing(false);
    setSupplierFormData({ name: '', contactName: '', category: 'Materiais Elétricos', marcas: [], email: '', fone: '', website: '' });
    setShowSupplierModal(true);
  };

  const handleEditSupplier = (s: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSupplierFormData({
      ...s,
      marcas: Array.isArray(s.marcas) ? s.marcas.join(', ') : s.marcas
    } as any);
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Excluir este fornecedor permanentemente?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marcasArray = typeof supplierFormData.marcas === 'string' 
      ? (supplierFormData.marcas as string).split(',').map(m => m.trim()).filter(m => m !== '')
      : supplierFormData.marcas || [];

    if (isEditing) {
      setSuppliers(suppliers.map(s => s.id === supplierFormData.id ? { ...supplierFormData, marcas: marcasArray } as Supplier : s));
    } else {
      const newSupplier: Supplier = {
        ...supplierFormData,
        id: `s-${Date.now()}`,
        marcas: marcasArray
      } as Supplier;
      setSuppliers([newSupplier, ...suppliers]);
    }
    
    setShowSupplierModal(false);
  };

  const handleOpenCatalog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowCatalogModal(true);
  };

  const renderSuppliers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Fornecedores de Materiais</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Catálogo de parceiros de suprimentos e logística.</p>
        </div>
        <button 
          onClick={handleOpenCreateSupplier}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Fornecedor</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(s => (
          <div 
            key={s.id} 
            onClick={() => handleOpenCatalog(s)}
            className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group relative cursor-pointer"
          >
            {/* Ações Rápidas */}
            <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
               <button 
                 onClick={(e) => handleEditSupplier(s, e)}
                 className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
               >
                 <Edit2 size={14} />
               </button>
               <button 
                 onClick={(e) => handleDeleteSupplier(s.id, e)}
                 className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
               >
                 <Trash2 size={14} />
               </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Building2 size={28} />
               </div>
               <div className="flex-1 min-w-0 pr-12">
                  <h3 className="font-black text-gray-900 dark:text-white leading-tight truncate">{s.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <UserIcon size={10} className="text-orange-500" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter truncate">Ct: {s.contactName}</p>
                  </div>
               </div>
            </div>
            <div className="space-y-3 mb-6">
               <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded text-[9px] font-black text-orange-600 uppercase tracking-tighter">{s.category}</span>
                  {s.marcas.slice(0, 3).map(m => (
                    <span key={m} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-[10px] font-black text-gray-400 uppercase tracking-tighter">{m}</span>
                  ))}
                  {s.marcas.length > 3 && <span className="text-[9px] font-black text-gray-300">+{s.marcas.length - 3} mais</span>}
               </div>
               <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                  <p className="text-xs font-bold text-gray-500 flex items-center gap-2 truncate"><Mail size={12} className="text-orange-500"/> {s.email}</p>
                  <p className="text-xs font-bold text-gray-500 flex items-center gap-2"><Phone size={12} className="text-orange-500"/> {s.fone}</p>
               </div>
            </div>
            <div className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
              Ver Catálogo <ChevronRight size={14} />
            </div>
          </div>
        ))}
        
        {suppliers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[40px]">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Nenhum fornecedor cadastrado</p>
          </div>
        )}
      </div>

      {/* Modal Catálogo do Fornecedor */}
      {showCatalogModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-950 rounded-[48px] w-full max-w-4xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
            
            {/* Header Catálogo */}
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-orange-50/30 dark:bg-orange-900/10">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                    <ShoppingBag size={32} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedSupplier.name}</h2>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                       <Tag size={12} /> {selectedSupplier.category}
                    </p>
                 </div>
               </div>
               <button onClick={() => setShowCatalogModal(false)} className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-all shadow-sm">
                 <X size={24} />
               </button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Informações de Contato e Marcas */}
               <div className="space-y-8">
                  <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <UserIcon size={14} className="text-orange-500" /> Pessoa de Contato
                     </h4>
                     <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{selectedSupplier.contactName}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Consultor Comercial</p>
                     </div>
                     <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-orange-200 transition-all border border-transparent">
                           <MessageCircle size={16} className="text-emerald-500" /> WhatsApp Direto
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-orange-200 transition-all border border-transparent">
                           <Mail size={16} className="text-blue-500" /> Enviar E-mail
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4 px-2">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marcas que Distribui</h4>
                     <div className="flex flex-wrap gap-2">
                        {selectedSupplier.marcas.map(m => (
                          <span key={m} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-orange-100 dark:border-orange-900/30">
                             {m}
                          </span>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Catálogo Sugerido (Mock) */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Bookmark size={14} className="text-orange-500" /> Itens de Linha / Catálogo
                     </h4>
                     <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                        Ver PDF Completo <ExternalLink size={12} />
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[1, 2, 3, 4].map((i) => (
                       <div key={i} className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] hover:border-orange-200 transition-all group flex items-start gap-4 shadow-sm">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-orange-600 group-hover:text-white transition-all">
                             <Package size={24} />
                          </div>
                          <div className="flex-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase">Linha Premium</p>
                             <h5 className="font-bold text-gray-900 dark:text-white text-sm">Produto Especializado {selectedSupplier.category.split(' ')[0]}</h5>
                             <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] font-black text-orange-600 uppercase">Sob Consulta</span>
                                <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-800 flex items-start gap-4">
                     <Info size={24} className="text-blue-500 shrink-0" />
                     <div>
                        <p className="text-[10px] font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-1">Dica de Suprimentos</p>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-relaxed italic">
                           Este fornecedor costuma oferecer condições especiais para pedidos em grande escala e faturamento direto para obra. Sempre solicite a tabela de preços para parceiros.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gray-400" />
                  <a href={`http://${selectedSupplier.website}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-orange-600 uppercase hover:underline">{selectedSupplier.website || 'Website não informado'}</a>
               </div>
               <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Catálogo Digital PrecificaPro v1.0</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo/Editar Fornecedor */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-2xl flex items-center justify-center">
                    {isEditing ? <Edit2 size={24} /> : <Building2 size={24} />}
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">{isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cadastro de Parceiro Comercial</p>
                 </div>
              </div>
              <button onClick={() => setShowSupplierModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveSupplier} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={12} /> Razão Social
                  </label>
                  <input 
                    required
                    type="text" 
                    value={supplierFormData.name}
                    onChange={(e) => setSupplierFormData({...supplierFormData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white" 
                    placeholder="Ex: Distribuidora de Cabos S.A" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon size={12} /> Nome do Contato
                  </label>
                  <input 
                    required
                    type="text" 
                    value={supplierFormData.contactName}
                    onChange={(e) => setSupplierFormData({...supplierFormData, contactName: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white" 
                    placeholder="Ex: Falar com Marcos" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria Principal</label>
                  <select 
                    value={supplierFormData.category}
                    onChange={(e) => setSupplierFormData({...supplierFormData, category: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white"
                  >
                    <option>Materiais Elétricos</option>
                    <option>Automação e Redes</option>
                    <option>Hidráulica e Metais</option>
                    <option>Revestimentos e Pedras</option>
                    <option>Mobiliário / Marcenaria</option>
                    <option>Tintas e Acabamentos</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Website / Portfolio</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="text" 
                      value={supplierFormData.website}
                      onChange={(e) => setSupplierFormData({...supplierFormData, website: e.target.value})}
                      className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white text-sm" 
                      placeholder="www.exemplo.com.br"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> E-mail de Vendas</label>
                  <input 
                    required
                    type="email" 
                    value={supplierFormData.email}
                    onChange={(e) => setSupplierFormData({...supplierFormData, email: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Phone size={12} /> WhatsApp / Televendas</label>
                  <input 
                    required
                    type="tel" 
                    value={supplierFormData.fone}
                    onChange={(e) => setSupplierFormData({...supplierFormData, fone: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white text-sm" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Marcas Representadas (Separadas por vírgula)</label>
                <textarea 
                  rows={2}
                  value={supplierFormData.marcas as any}
                  onChange={(e) => setSupplierFormData({...supplierFormData, marcas: e.target.value as any})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-gray-900 dark:text-white text-sm resize-none" 
                  placeholder="Ex: Tigre, Deca, Amanco, Docol"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setShowSupplierModal(false)} 
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                >
                  <CheckCircle2 size={18} /> {isEditing ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      {/* Header Centralizado */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Central de Cadastros</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Gerencie sua rede de contatos e parceiros em um único lugar.</p>
        </div>

        {/* Sistema de Abas Estilo Cápsula */}
        <div className="flex p-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] shadow-sm self-start lg:self-auto overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === 'clients' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <Users size={16} /> Clientes
          </button>
          <button 
            onClick={() => setActiveTab('providers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === 'providers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <HardHat size={16} /> Prestadores
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === 'suppliers' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            <Building2 size={16} /> Fornecedores
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'clients' && <ClientsPage />}
        {activeTab === 'providers' && <Providers />}
        {activeTab === 'suppliers' && renderSuppliers()}
      </div>
    </div>
  );
};

export default Registrations;
