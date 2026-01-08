
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Hammer, Search, DollarSign, RotateCcw, ArrowLeft, Calendar, 
  Users, ArrowDownCircle, ArrowUpCircle, ChevronRight, FileText, 
  Layout, Briefcase, X, CheckCircle2, Target, PieChart, Info,
  Box, Layers, Home, Droplets, Zap, ShieldCheck, Square, Palette, Brush, Cpu, Trees
} from 'lucide-react';
import { Project, ProjectExpense, ETAPAS_DEFAULT, ProjetoOrcamentoEtapa, NomeEtapaObra } from '../types';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: 'p1', 
      name: 'Apartamento Granja Viana', 
      clientId: 'c1', 
      clientName: 'Mauro Silva', 
      totalBudget: 45000, 
      spentAmount: 12450.00, 
      startDate: '2024-03-15', 
      status: 'active' 
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'finance' | 'scope' | 'budget'>('finance');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const [projectStages, setProjectStages] = useState<ProjetoOrcamentoEtapa[]>([]);

  const handleGenerateBudget = () => {
    if (!selectedProject) return;
    
    const stages: ProjetoOrcamentoEtapa[] = ETAPAS_DEFAULT.map(config => ({
      id: Math.random().toString(36).substr(2, 9),
      projetoId: selectedProject.id,
      resumoId: 'res-1',
      nomeEtapa: config.nomeEtapa,
      label: config.label,
      percentualPrevisto: config.percentualSugerido,
      valorPrevisto: (selectedProject.totalBudget * config.percentualSugerido) / 100,
      faixaPercentualMin: config.faixaPercentualMin,
      faixaPercentualMax: config.faixaPercentualMax,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    }));

    setProjectStages(stages);
  };

  const getStageIcon = (nome: NomeEtapaObra) => {
    switch (nome) {
      case 'projeto_aprovacoes': return <FileText size={18} />;
      case 'fundacoes': return <ArrowDownCircle size={18} />;
      case 'estrutura': return <Box size={18} />;
      case 'alvenaria_vedacoes': return <Layers size={18} />;
      case 'cobertura': return <Home size={18} />;
      case 'instalacao_hidraulica': return <Droplets size={18} />;
      case 'instalacao_eletrica': return <Zap size={18} />;
      case 'impermeabilizacao': return <ShieldCheck size={18} />;
      case 'esquadrias': return <Square size={18} />;
      case 'revestimentos_acabamentos': return <Palette size={18} />;
      case 'pintura': return <Brush size={18} />;
      case 'automacao': return <Cpu size={18} />;
      case 'servicos_complementares': return <Trees size={18} />;
      default: return <Hammer size={18} />;
    }
  };

  const budgetUsagePercent = selectedProject 
    ? (selectedProject.spentAmount / selectedProject.totalBudget) * 100 
    : 0;

  if (selectedProject) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => { setSelectedProject(null); setProjectStages([]); }}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Projetos
          </button>
          
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'finance' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <DollarSign size={14} /> Financeiro
            </button>
            <button 
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'budget' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <PieChart size={14} /> Orçamento
            </button>
            <button 
              onClick={() => setActiveTab('scope')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'scope' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <Layout size={14} /> Briefing
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">Obra Ativa</span>
           </div>
           <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{selectedProject.name}</h1>
           <div className="flex items-center gap-4 text-gray-500 mb-8">
              <div className="flex items-center gap-2 font-bold text-sm">
                 <Calendar size={16} /> {new Date(selectedProject.startDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-2 font-bold text-sm">
                 <Users size={16} /> {selectedProject.clientName}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-4">
                 <div className="flex items-end justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consumo Total do Budget</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{budgetUsagePercent.toFixed(1)}%</p>
                 </div>
                 <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                       className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                       style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                    />
                 </div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo Disponível</p>
                    <p className="text-2xl font-black text-emerald-600">R$ {(selectedProject.totalBudget - selectedProject.spentAmount).toLocaleString('pt-BR')}</p>
                 </div>
                 <button 
                  onClick={() => navigate(`/projects/${selectedProject.id}/finances`)}
                  className="px-6 py-3 bg-white dark:bg-gray-900 rounded-xl text-emerald-600 font-black uppercase text-[10px] shadow-sm hover:scale-105 transition-all flex items-center gap-2"
                 >
                   <Plus size={16} /> Lançar Despesa
                 </button>
              </div>
           </div>
        </div>

        {activeTab === 'budget' && (
          <div className="space-y-6">
            {projectStages.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-[40px] p-12 border-2 border-dashed border-gray-100 dark:border-gray-800 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-600">
                  <PieChart size={40} />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Orçamento por Etapas</h3>
                  <p className="text-gray-500 text-sm font-medium mb-8">Nenhum orçamento detalhado foi gerado para esta obra ainda. Deseja criar uma estimativa baseada nos padrões de mercado?</p>
                  <button 
                    onClick={handleGenerateBudget}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={20} /> Gerar Estimativa por Etapas
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                   <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                     <Layers size={20} className="text-emerald-500" /> Distribuição Financeira
                   </h2>
                   <div className="space-y-4">
                     {projectStages.map(stage => (
                       <div key={stage.id} className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all">
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-gray-50 dark:border-gray-800">
                                   {getStageIcon(stage.nomeEtapa)}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{stage.label}</p>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase">{stage.percentualPrevisto}% do total</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-emerald-600">R$ {stage.valorPrevisto.toLocaleString('pt-BR')}</p>
                             </div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: `${stage.percentualPrevisto}%` }} />
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-600/20">
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Info size={24} />
                         </div>
                         <h3 className="text-lg font-black uppercase tracking-widest">Resumo do Planejamento</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-emerald-100 uppercase">Total Estimado</p>
                            <p className="text-2xl font-black">R$ {selectedProject.totalBudget.toLocaleString('pt-BR')}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-emerald-100 uppercase">Nº de Etapas</p>
                            <p className="text-2xl font-black">{projectStages.length}</p>
                         </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/20">
                         <p className="text-xs font-medium text-emerald-50 leading-relaxed italic">
                           "Estes percentuais são baseados em padrões de obras de médio/alto padrão. Você pode ajustar cada etapa manualmente no dossiê técnico."
                         </p>
                      </div>
                   </div>

                   <button className="w-full py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl text-sm font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                      <FileText size={20} /> Exportar Orçamento PDF
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 gap-6">
             <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                   <h2 className="text-xl font-black text-gray-900 dark:text-white">Últimos Lançamentos</h2>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => navigate(`/projects/${selectedProject.id}/finances`)}
                        className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:underline"
                      >
                        Gerenciar Todos <ChevronRight size={12}/>
                      </button>
                   </div>
                </div>
                <div className="p-8 text-center py-20">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="text-gray-300" size={32} />
                   </div>
                   <p className="text-sm font-bold text-gray-500">Acesse o Dossiê Financeiro para lançar e visualizar despesas.</p>
                   <button 
                      onClick={() => navigate(`/projects/${selectedProject.id}/finances`)}
                      className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase"
                   >
                     Abrir Finanças
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'scope' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                   <FileText size={16} className="text-emerald-500" /> Dossie Técnico
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tipo de Intervenção</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Reforma de Interiores com Automação</p>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Áreas Principais</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Cozinha, Sala de Estar, Suíte Master</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Obras e Projetos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Gestão centralizada de execução e custos.</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Iniciar Novo Projeto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => {
          const usage = (project.spentAmount / project.totalBudget) * 100;
          return (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Hammer size={28} />
                </div>
                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {project.status === 'active' ? 'Em execução' : 'Concluído'}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">{project.name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Users size={14} /> {project.clientName}
                </p>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gasto Atual</p>
                      <p className="font-black text-gray-900 dark:text-white">R$ {project.spentAmount.toLocaleString('pt-BR')}</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget Total</p>
                      <p className="font-bold text-gray-500">R$ {project.totalBudget.toLocaleString('pt-BR')}</p>
                   </div>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${usage > 90 ? 'bg-rose-500' : usage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(usage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                 <span className="text-xs font-bold text-gray-500 uppercase">Ver Dossie Completo</span>
                 <ChevronRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Projects;
