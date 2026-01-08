
import React, { useState } from 'react';
import { 
  Users, HardHat, Building2, Search, Plus, Filter, 
  ExternalLink, Mail, Phone, Home, Star, Cpu, Zap,
  ChevronRight, CreditCard, CheckCircle2, X, MapPin, Hash
} from 'lucide-react';
import ClientsPage from './Clients'; // Reutilizaremos o componente existente
import Providers from './Providers'; // Reutilizaremos o componente existente

type TabType = 'clients' | 'providers' | 'suppliers';

const Registrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clients');

  // Mock para Fornecedores (Novidade solicitada)
  const [suppliers] = useState([
    { id: 's1', name: 'Distribuidora Luz & Som', category: 'Materiais Elétricos', marcas: ['Savant', 'Sonos'], email: 'vendas@luzsom.com.br', fone: '(11) 4004-1010' },
    { id: 's2', name: 'Mármores Granito S.A', category: 'Pedras e Revestimentos', marcas: ['Dekton', 'Silestone'], email: 'comercial@granitosa.com', fone: '(11) 3333-2222' }
  ]);

  const renderSuppliers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Fornecedores de Materiais</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Catálogo de parceiros de suprimentos e logística.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95">
          <Plus size={18} /> Novo Fornecedor
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600">
                  <Building2 size={28} />
               </div>
               <div>
                  <h3 className="font-black text-gray-900 dark:text-white leading-tight">{s.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{s.category}</p>
               </div>
            </div>
            <div className="space-y-3 mb-6">
               <div className="flex flex-wrap gap-2">
                  {s.marcas.map(m => (
                    <span key={m} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-[10px] font-black text-gray-500 uppercase tracking-tighter">{m}</span>
                  ))}
               </div>
               <p className="text-xs font-bold text-gray-500 flex items-center gap-2"><Mail size={12}/> {s.email}</p>
               <p className="text-xs font-bold text-gray-500 flex items-center gap-2"><Phone size={12}/> {s.fone}</p>
            </div>
            <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
              Ver Catálogo <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
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
