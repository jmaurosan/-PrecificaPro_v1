
import React, { useState, useMemo } from 'react';
import { 
  Plus, Hammer, Search, DollarSign, RotateCcw, ArrowLeft, Calendar, 
  Users, ArrowDownCircle, ArrowUpCircle, ChevronRight, FileText, 
  Layout, Briefcase
} from 'lucide-react';
import { Project, ProjectExpense } from '../types';

const Projects: React.FC = () => {
  const [projects] = useState<Project[]>([
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
  const [activeTab, setActiveTab] = useState<'finance' | 'scope'>('finance');

  const budgetUsagePercent = selectedProject 
    ? (selectedProject.spentAmount / selectedProject.totalBudget) * 100 
    : 0;

  if (selectedProject) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Projetos
          </button>
          
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'finance' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <DollarSign size={14} /> Financeiro
            </button>
            <button 
              onClick={() => setActiveTab('scope')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'scope' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <Layout size={14} /> Escopo e Briefing
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Obra Ativa</span>
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orçamento Consumido</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{budgetUsagePercent.toFixed(1)}%</p>
                 </div>
                 <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                       className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                       style={{ width: `${budgetUsagePercent}%` }}
                    />
                 </div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo Disponível</p>
                    <p className="text-2xl font-black text-emerald-600">R$ {(selectedProject.totalBudget - selectedProject.spentAmount).toLocaleString('pt-BR')}</p>
                 </div>
                 <button className="p-3 bg-white dark:bg-gray-900 rounded-xl text-emerald-600 shadow-sm"><Plus size={20} /></button>
              </div>
           </div>
        </div>

        {activeTab === 'finance' ? (
          <div className="grid grid-cols-1 gap-6">
             <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                   <h2 className="text-xl font-black text-gray-900 dark:text-white">Últimos Lançamentos</h2>
                   <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500"><ArrowDownCircle size={12}/> Despesa</span>
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-500"><RotateCcw size={12}/> Devolução</span>
                   </div>
                </div>
                <div className="p-8 text-center py-20">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="text-gray-300" size={32} />
                   </div>
                   <p className="text-sm font-bold text-gray-500">Nenhum lançamento registrado para esta obra.</p>
                </div>
             </div>
          </div>
        ) : (
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
             <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Briefcase size={16} className="text-blue-500" /> Profissionais Alocados
                </h3>
                <div className="space-y-2">
                   <div className="flex items-center justify-between p-3 border border-gray-50 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-[10px]">E</div>
                         <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Elite Smart Home</span>
                      </div>
                      <span className="text-[10px] font-black text-blue-600 uppercase">Automação</span>
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
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
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
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
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
