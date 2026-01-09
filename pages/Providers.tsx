
import React, { useState } from 'react';
import { 
  Plus, Search, HardHat, Cpu, Star, Mail, Phone, 
  ChevronRight, Filter, Zap, CheckCircle2, X, Building2, User as UserIcon,
  Droplets, Brush, Layers, Hammer, ShieldCheck, ZapOff, Edit2, Trash2,
  Award, MapPin, ExternalLink, Briefcase, FileText, Globe, MessageCircle
} from 'lucide-react';
import { Prestador, TipoPessoa } from '../types';

type RamoAtividade = 'Automação' | 'Elétrica' | 'Hidráulica' | 'Pintura' | 'Gesso' | 'Marcenaria' | 'Alvenaria/Civil';

const Providers: React.FC = () => {
  const [providers, setProviders] = useState<Prestador[]>([
    {
      id: '1',
      nome: 'Elite Smart Home',
      tipoCadastro: 'PJ',
      cpfCnpj: '12.345.678/0001-90',
      ramoAtividade: 'Automação',
      categoriaPrincipal: 'Senior',
      subcategorias: ['Iluminação', 'Home Theater'],
      atuaEmAutomacaoResidencial: true,
      tiposSistemasAutomacao: ['Iluminação', 'Áudio e Vídeo', 'Redes', 'Segurança'],
      marcasTrabalhadas: ['Lutron', 'Control4', 'Savant', 'Ubiquiti'],
      email: 'contato@elitesmart.com',
      telefoneCelular: '(11) 98888-7777',
      statusCadastro: 'aprovado',
      notaMedia: 4.9
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDossieModal, setShowDossieModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Prestador | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState: Partial<Prestador> = {
    tipoCadastro: 'PJ',
    nome: '',
    cpfCnpj: '',
    ramoAtividade: 'Automação',
    categoriaPrincipal: 'Pleno',
    atuaEmAutomacaoResidencial: true,
    tiposSistemasAutomacao: [],
    marcasTrabalhadas: [],
    email: '',
    telefoneCelular: '',
    statusCadastro: 'em_analise'
  };

  const [formData, setFormData] = useState<Partial<Prestador>>(initialFormState);

  const ramos: RamoAtividade[] = ['Automação', 'Elétrica', 'Hidráulica', 'Pintura', 'Gesso', 'Marcenaria', 'Alvenaria/Civil'];

  const filteredProviders = providers.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ramoAtividade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSistemas = (sistema: string) => {
    const atual = formData.tiposSistemasAutomacao || [];
    if (atual.includes(sistema)) {
      setFormData({ ...formData, tiposSistemasAutomacao: atual.filter(s => s !== sistema) });
    } else {
      setFormData({ ...formData, tiposSistemasAutomacao: [...atual, sistema] });
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleOpenDossie = (p: Prestador) => {
    setSelectedProvider(p);
    setShowDossieModal(true);
  };

  const handleEditProvider = (p: Prestador, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setFormData({
      ...p,
      marcasTrabalhadas: Array.isArray(p.marcasTrabalhadas) ? p.marcasTrabalhadas.join(', ') : p.marcasTrabalhadas
    } as any);
    setShowModal(true);
  };

  const handleDeleteProvider = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Excluir este prestador permanentemente?')) {
      setProviders(providers.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const marcasArray = typeof formData.marcasTrabalhadas === 'string' 
      ? (formData.marcasTrabalhadas as string).split(',').map(m => m.trim()).filter(m => m !== '')
      : formData.marcasTrabalhadas || [];

    if (isEditing) {
      setProviders(providers.map(p => p.id === formData.id ? { ...formData, marcasTrabalhadas: marcasArray } as Prestador : p));
    } else {
      const newProvider: Prestador = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        subcategorias: [], 
        notaMedia: 0,
        marcasTrabalhadas: marcasArray
      } as Prestador;
      setProviders([newProvider, ...providers]);
    }
    setShowModal(false);
    setFormData(initialFormState);
  };

  const getRamoIcon = (ramo: string) => {
    switch (ramo) {
      case 'Automação': return <Cpu size={18} />;
      case 'Elétrica': return <Zap size={18} />;
      case 'Hidráulica': return <Droplets size={18} />;
      case 'Pintura': return <Brush size={18} />;
      case 'Gesso': return <Layers size={18} />;
      case 'Alvenaria/Civil': return <HardHat size={18} />;
      default: return <Hammer size={18} />;
    }
  };

  const renderEspecializacaoContent = () => {
    switch (formData.ramoAtividade as RamoAtividade) {
      case 'Automação':
        return (
          <>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={12}/> Sistemas que Trabalha
              </label>
              <div className="flex flex-wrap gap-2">
                {['Iluminação', 'Áudio & Vídeo', 'Segurança', 'Climatização', 'Redes'].map(s => {
                  const isSelected = formData.tiposSistemasAutomacao?.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => handleToggleSistemas(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-gray-900 border-blue-100 dark:border-blue-800 text-blue-600'}`}>{s}</button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Marcas Homologadas</label>
              <input type="text" value={formData.marcasTrabalhadas as any} onChange={(e) => setFormData({ ...formData, marcasTrabalhadas: e.target.value as any })} className="w-full px-5 py-4 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 rounded-2xl font-bold outline-none focus:border-blue-500 text-gray-900 dark:text-white" placeholder="Ex: Lutron, Control4, Savant" />
            </div>
          </>
        );
      default:
        return (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detalhes da Mão de Obra</label>
            <textarea rows={3} className="w-full px-5 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-gray-900 dark:text-white resize-none" placeholder="Descreva as especialidades técnicas deste profissional..." />
          </div>
        );
    }
  };

  const getThemeColor = () => {
    switch (formData.ramoAtividade) {
      case 'Automação': return 'blue';
      case 'Elétrica': return 'amber';
      case 'Hidráulica': return 'emerald';
      default: return 'emerald';
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Prestadores e Parceiros</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Homologação de profissionais e especialistas técnicos.</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Plus size={20} />
          <span>Cadastrar Prestador</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Busque por nome, categoria ou especialidade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 dark:text-white transition-all shadow-sm font-bold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProviders.map(provider => (
          <div key={provider.id} className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all relative">
            <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
               <button onClick={(e) => handleEditProvider(provider, e)} className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={14} /></button>
               <button onClick={(e) => handleDeleteProvider(provider.id, e)} className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={14} /></button>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white`}>
                  {getRamoIcon(provider.ramoAtividade)}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                   <h3 className="font-black text-gray-900 dark:text-white leading-tight truncate">{provider.nome}</h3>
                   <div className="flex items-center gap-1.5 mt-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-gray-500">{provider.notaMedia || 'S/N'}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{provider.ramoAtividade}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
               <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500"><Mail size={14} className="text-gray-300" /> {provider.email}</div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500"><Phone size={14} className="text-gray-300" /> {provider.telefoneCelular}</div>
               </div>
            </div>

            <button onClick={() => handleOpenDossie(provider)} className="w-full py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">Dossiê do Prestador <ChevronRight size={14} /></button>
          </div>
        ))}
      </div>

      {/* Modal Dossie Digital - Ajuste de Tamanho */}
      {showDossieModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[70] p-4 backdrop-blur-xl">
          <div className="bg-white dark:bg-gray-950 rounded-[48px] w-full max-w-5xl max-h-[95vh] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-emerald-600 rounded-[24px] flex items-center justify-center text-white shadow-xl">
                    {getRamoIcon(selectedProvider.ramoAtividade)}
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedProvider.nome}</h2>
                   <div className="flex gap-3 mt-1">
                     <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedProvider.statusCadastro}</span>
                     <span className="px-3 py-1 bg-white dark:bg-gray-800 text-amber-500 border border-amber-100 dark:border-amber-900/30 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Star size={10} className="fill-amber-500"/> {selectedProvider.notaMedia}
                     </span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setShowDossieModal(false)} className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 custom-scrollbar">
              <div className="space-y-8">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14} className="text-emerald-500" /> Contatos</h4>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                          <Mail size={18} className="text-emerald-600" />
                          <div className="min-w-0"><p className="text-[8px] font-black text-gray-400 uppercase">E-mail</p><p className="text-xs font-bold truncate">{selectedProvider.email}</p></div>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                          <Phone size={18} className="text-emerald-600" />
                          <div className="min-w-0"><p className="text-[8px] font-black text-gray-400 uppercase">WhatsApp</p><p className="text-xs font-bold truncate">{selectedProvider.telefoneCelular}</p></div>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-emerald-600 rounded-[32px] text-white">
                    <p className="text-[9px] font-black uppercase opacity-70 mb-1">Categoria Técnica</p>
                    <h3 className="text-2xl font-black">{selectedProvider.categoriaPrincipal}</h3>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-10">
                 <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6"><Zap size={18} className="text-emerald-500" /> Expertise</h3>
                    {selectedProvider.atuaEmAutomacaoResidencial ? (
                      <div className="space-y-6">
                        <div><p className="text-[9px] font-black text-gray-400 uppercase mb-3">Sistemas</p><div className="flex flex-wrap gap-2">{selectedProvider.tiposSistemasAutomacao.map(s => <span key={s} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-[9px] font-black uppercase border border-blue-100">{s}</span>)}</div></div>
                        <div><p className="text-[9px] font-black text-gray-400 uppercase mb-3">Marcas</p><div className="flex flex-wrap gap-2">{selectedProvider.marcasTrabalhadas.map(m => <span key={m} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 rounded-xl text-[9px] font-black uppercase border border-gray-100">{m}</span>)}</div></div>
                      </div>
                    ) : <p className="text-sm font-bold text-gray-500 italic">Prestador generalista em {selectedProvider.ramoAtividade}.</p>}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cadastro - Ajuste para scroll interno */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{isEditing ? 'Editar Prestador' : 'Homologação de Prestador'}</h2>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form id="provider-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-emerald-50 dark:border-emerald-900/20 pb-2 flex items-center gap-2"><UserIcon size={14}/> 1. Identificação</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setFormData({ ...formData, tipoCadastro: 'PJ' })} className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] transition-all border ${formData.tipoCadastro === 'PJ' ? 'bg-emerald-600 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'}`}>PJ</button>
                        <button type="button" onClick={() => setFormData({ ...formData, tipoCadastro: 'PF' })} className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] transition-all border ${formData.tipoCadastro === 'PF' ? 'bg-emerald-600 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-400'}`}>PF</button>
                      </div>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ramo Atividade</label><select value={formData.ramoAtividade} onChange={(e) => setFormData({...formData, ramoAtividade: e.target.value as any})} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold">{ramos.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome / Razão Social</label><input required type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documento</label><input required type="text" value={formData.cpfCnpj} onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</label><input required type="tel" value={formData.telefoneCelular} onChange={(e) => setFormData({ ...formData, telefoneCelular: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold" /></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={`p-8 rounded-[40px] border transition-all duration-500 ${formData.atuaEmAutomacaoResidencial ? `bg-${getThemeColor()}-50/30 border-${getThemeColor()}-200` : 'bg-gray-50 dark:bg-gray-900 border-gray-100'}`}>
                      <div className="flex items-center justify-between mb-8">
                        <div><h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">2. Especialização</h3><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Especialista Técnico?</p></div>
                        <button type="button" onClick={() => setFormData({ ...formData, atuaEmAutomacaoResidencial: !formData.atuaEmAutomacaoResidencial })} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${formData.atuaEmAutomacaoResidencial ? `bg-${getThemeColor()}-600` : 'bg-gray-300'}`}><span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.atuaEmAutomacaoResidencial ? 'translate-x-6' : 'translate-x-1'}`} /></button>
                      </div>
                      {formData.atuaEmAutomacaoResidencial ? <div className="space-y-6">{renderEspecializacaoContent()}</div> : <div className="py-10 text-center"><ZapOff className="text-gray-300 mx-auto mb-3" size={24} /><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prestador de Apoio Convencional</p></div>}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex gap-4 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white dark:bg-gray-800 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Cancelar</button>
              <button form="provider-form" type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg uppercase tracking-widest text-[10px]"><CheckCircle2 size={18} /> {isEditing ? 'Salvar' : 'Homologar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
