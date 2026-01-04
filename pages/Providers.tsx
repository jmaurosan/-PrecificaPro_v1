
import React, { useState } from 'react';
import { 
  Plus, Search, HardHat, Cpu, Star, Mail, Phone, 
  ChevronRight, Filter, Zap, CheckCircle2, X, Building2, User as UserIcon
} from 'lucide-react';
import { Prestador, TipoPessoa } from '../types';

const Providers: React.FC = () => {
  const [providers, setProviders] = useState<Prestador[]>([
    {
      id: '1',
      nome: 'Elite Smart Home',
      tipoCadastro: 'PJ',
      cpfCnpj: '12.345.678/0001-90',
      ramoAtividade: 'Tecnologia Residencial',
      categoriaPrincipal: 'Automação',
      subcategorias: ['Iluminação', 'Home Theater'],
      atuaEmAutomacaoResidencial: true,
      tiposSistemasAutomacao: ['Iluminação', 'Áudio e Vídeo', 'Redes'],
      marcasTrabalhadas: ['Lutron', 'Control4'],
      email: 'contato@elitesmart.com',
      telefoneCelular: '(11) 98888-7777',
      statusCadastro: 'aprovado',
      notaMedia: 4.9
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.marcasTrabalhadas.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Prestadores e Parceiros</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Homologação de profissionais e especialistas em automação.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Cadastrar Prestador</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Busque por nome, categoria ou marca (ex: Lutron, Savant)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all shadow-sm font-bold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProviders.map(provider => (
          <div key={provider.id} className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                  provider.atuaEmAutomacaoResidencial 
                  ? 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' 
                  : 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800'
                }`}>
                  {provider.atuaEmAutomacaoResidencial ? <Cpu size={28} /> : <HardHat size={28} />}
                </div>
                <div>
                   <h3 className="font-black text-gray-900 dark:text-white leading-tight">
                     {provider.nome}
                   </h3>
                   <div className="flex items-center gap-1.5 mt-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-gray-500">{provider.notaMedia || 'S/N'}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{provider.categoriaPrincipal}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
               {provider.atuaEmAutomacaoResidencial && (
                 <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-50 dark:border-blue-900/20">
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                       <Zap size={10} /> Especialista em Automação
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {provider.marcasTrabalhadas.map(m => (
                         <span key={m} className="px-2 py-0.5 bg-white dark:bg-gray-800 text-[10px] font-black text-blue-700 dark:text-blue-400 rounded border border-blue-100 dark:border-blue-800">{m}</span>
                       ))}
                    </div>
                 </div>
               )}
               <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                     <Mail size={14} className="text-gray-300" /> {provider.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                     <Phone size={14} className="text-gray-300" /> {provider.telefoneCelular}
                  </div>
               </div>
            </div>

            <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
              Dossiê do Prestador <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal Cadastro de Prestador */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-3xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Homologação de Prestador</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Dados Básicos */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest">1. Identificação</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Tipo de Cadastro</label>
                    <div className="flex gap-2">
                      <button type="button" className="flex-1 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                        <Building2 size={16} /> Pessoa Jurídica
                      </button>
                      <button type="button" className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                        <UserIcon size={16} /> Pessoa Física
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Nome / Razão Social</label>
                    <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" placeholder="Ex: Elite Smart Home LTDA" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">CNPJ / CPF</label>
                      <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Ramo de Atividade</label>
                      <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" placeholder="Ex: Elétrica" />
                    </div>
                  </div>
                </div>

                {/* Especialização em Automação */}
                <div className="space-y-6 bg-blue-50/30 dark:bg-blue-900/5 p-6 rounded-3xl border border-blue-100/50 dark:border-blue-900/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">2. Automação Residencial</h3>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-400 uppercase">Sistemas que Trabalha</label>
                      <div className="flex flex-wrap gap-2">
                        {['Iluminação', 'Áudio & Vídeo', 'Segurança', 'Climatização', 'Redes'].map(s => (
                          <button key={s} type="button" className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 rounded-lg text-[10px] font-bold text-blue-600">{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-400 uppercase">Marcas Homologadas (Separadas por vírgula)</label>
                      <input type="text" className="w-full px-5 py-3 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 rounded-xl font-bold outline-none" placeholder="Ex: Lutron, Savant, Control4" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-400 uppercase">Serviços Oferecidos</label>
                      <textarea className="w-full px-5 py-3 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 rounded-xl font-bold outline-none resize-none" rows={2} placeholder="Projeto, Instalação, Configuração..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Salvar e Finalizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
