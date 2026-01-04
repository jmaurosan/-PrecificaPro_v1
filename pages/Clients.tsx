
import React, { useState } from 'react';
import { 
  Plus, Search, Mail, Phone, Building, Edit2, Trash2, MapPin, 
  ExternalLink, Users, Hash, FileText, Layout, Home, 
  UserCheck, CreditCard, Calendar, ChevronRight, ChevronLeft,
  CheckCircle2, Briefcase, Ruler
} from 'lucide-react';
import { Client, TipoPessoa, TipoImovel, StatusLead } from '../types';

const ClientsPage: React.FC = () => {
  // Mock data atualizado para o novo modelo
  const [clients] = useState<Client[]>([
    { 
      id: '1', 
      tipo: 'PF',
      nome: 'João Silva', 
      cpfCnpj: '123.456.789-00',
      email: 'joao@email.com', 
      telefones: { celular: '(11) 99999-9999', whatsapp: '(11) 99999-9999' },
      enderecoCorrespondencia: { logradouro: 'Rua A', numero: '10', bairro: 'Centro', cidade: 'SP', uf: 'SP', cep: '01000-000' },
      imovel: {
        tipo: 'casa',
        endereco: { logradouro: 'Condomínio Solar', numero: 'S/N', bairro: 'Vila Real', cidade: 'SP', uf: 'SP', cep: '01000-000', quadra: '04', lote: '12' },
        situacaoPosse: 'proprietario',
        metragemM2: 250,
        condominio: { nome: 'Solar das Palmeiras' }
      },
      status: 'contratado',
      createdAt: new Date('2024-01-05')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const filteredClients = clients.filter(
    (client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: StatusLead) => {
    switch (status) {
      case 'contratado': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'em_briefing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'novo': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'perdido': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gestão de Clientes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Cadastro completo de leads, clientes e especificações técnicas.</p>
        </div>
        <button
          onClick={() => { setStep(1); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Cliente / Lead</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, documento ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="group bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-all flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                  {client.tipo === 'PF' ? <Users size={24} /> : <Building size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{client.nome}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1 ${getStatusStyle(client.status)}`}>
                    {client.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"><Edit2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <CreditCard size={14} /> {client.cpfCnpj}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <Mail size={14} /> {client.email}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl space-y-2">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                       <Home size={12} /> Imóvel: {client.imovel.tipo}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                       {client.imovel.metragemM2}m²
                    </span>
                 </div>
                 <p className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1">
                    {client.imovel.endereco.logradouro}, {client.imovel.endereco.numero}
                 </p>
                 <div className="flex gap-2">
                    {client.imovel.endereco.quadra && (
                      <span className="px-2 py-0.5 bg-white dark:bg-gray-900 rounded-md text-[10px] font-bold border border-gray-100 dark:border-gray-800">Qd: {client.imovel.endereco.quadra}</span>
                    )}
                    {client.imovel.endereco.lote && (
                      <span className="px-2 py-0.5 bg-white dark:bg-gray-900 rounded-md text-[10px] font-bold border border-gray-100 dark:border-gray-800">Lote: {client.imovel.endereco.lote}</span>
                    )}
                 </div>
              </div>
            </div>

            <button className="w-full py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2">
              Acessar Dossiê Completo <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal Cadastro Robusto (Stepper) */}
      {showModal && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-gray-950 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8">
                {/* Header Stepper */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Dossiê de Novo Cliente</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                      <Plus size={24} className="rotate-45" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 -z-10"></div>
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                        step >= s ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-300'
                      }`}>
                        {step > s ? <CheckCircle2 size={20} /> : s}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-[10px] font-black uppercase text-gray-400">Cliente</span>
                    <span className="text-[10px] font-black uppercase text-gray-400">Imóvel</span>
                    <span className="text-[10px] font-black uppercase text-gray-400">Briefing</span>
                    <span className="text-[10px] font-black uppercase text-gray-400">Finalizar</span>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                   {step === 1 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Pessoa</label>
                             <div className="flex gap-2">
                                <button className="flex-1 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold">Física (PF)</button>
                                <button className="flex-1 py-3 bg-gray-50 dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800 rounded-xl font-bold">Jurídica (PJ)</button>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome Completo</label>
                             <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold outline-none" placeholder="Nome do cliente" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documento (CPF/CNPJ)</label>
                             <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail Principal</label>
                             <input type="email" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp / Celular</label>
                             <input type="tel" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Inicial</label>
                             <select className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none">
                                <option value="novo">Lead Novo</option>
                                <option value="em_briefing">Em Briefing</option>
                             </select>
                           </div>
                        </div>
                     </div>
                   )}

                   {step === 2 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-3 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Imóvel</label>
                             <select className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none">
                                <option value="casa">Casa</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="comercial">Comercial</option>
                                <option value="terreno">Terreno</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Situação de Posse</label>
                             <select className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none">
                                <option value="proprietario">Proprietário</option>
                                <option value="locatario">Locatário</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Área Total (m²)</label>
                             <div className="relative">
                               <input type="number" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">m²</span>
                             </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Endereço da Obra/Imóvel</label>
                           <input type="text" placeholder="Rua, Número, Bairro..." className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Hash size={12}/> Quadra</label>
                             <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Hash size={12}/> Lote</label>
                             <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Condomínio (Se houver)</label>
                           <input type="text" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                        </div>
                     </div>
                   )}

                   {step === 3 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Projeto</label>
                             <select className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none">
                                <option value="reforma_completa">Reforma Completa</option>
                                <option value="reforma_parcial">Reforma Parcial</option>
                                <option value="interiores">Interiores / Decoração</option>
                                <option value="consultoria">Consultoria Técnica</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Objetivo Principal</label>
                             <input type="text" placeholder="Ex: Modernizar a cozinha" className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estilo Desejado</label>
                           <input type="text" placeholder="Ex: Industrial, Minimalista, Clássico..." className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ambientes a serem trabalhados</label>
                           <textarea rows={2} placeholder="Ex: Sala de estar, Varanda Gourmet, Suíte Master..." className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none resize-none" />
                        </div>
                     </div>
                   )}

                   {step === 4 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                           <h3 className="text-emerald-800 dark:text-emerald-400 font-black text-sm uppercase tracking-widest mb-4">Investimento e Prazos</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Orçamento Estimado (R$)</label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-emerald-600">R$</span>
                                  <input type="number" className="w-full pl-10 pr-5 py-3 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800 rounded-xl font-bold outline-none" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Prazo de Entrega Desejado</label>
                                <input type="date" className="w-full px-5 py-3 bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800 rounded-xl font-bold outline-none" />
                              </div>
                           </div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                           <h3 className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest mb-4">Notas e Observações Internas</h3>
                           <textarea rows={4} className="w-full px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl font-bold outline-none resize-none" placeholder="Detalhes relevantes sobre o cliente ou negociação..." />
                        </div>
                     </div>
                   )}

                   <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                    {step > 1 && (
                      <button onClick={prevStep} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
                        <ChevronLeft size={20} /> Anterior
                      </button>
                    )}
                    <div className="flex-1"></div>
                    {step < 4 ? (
                      <button onClick={nextStep} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                        Próximo Passo <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button onClick={() => setShowModal(false)} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                        Finalizar Cadastro <CheckCircle2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ClientsPage;
