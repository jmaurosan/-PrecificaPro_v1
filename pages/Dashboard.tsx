
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, DollarSign, FileText, Users, Calculator,
  Briefcase, ArrowUpRight, Calendar, Filter, Check, 
  Hammer, ChevronRight, AlertTriangle, PieChart, Activity,
  // Add missing icon
  Plus
} from 'lucide-react';

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Apartamento Granja Viana', client: 'Mauro Silva', budget: 45000, spent: 12450, progress: 28, status: 'active' },
  { id: 'p2', name: 'Residência Alphaville', client: 'Ana Paula', budget: 120000, spent: 85000, progress: 70, status: 'active' },
  { id: 'p3', name: 'Loja Shopping Center', client: 'Grupo Moda', budget: 35000, spent: 38000, progress: 100, status: 'warning' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [filterPeriod, setFilterPeriod] = useState('thisMonth');

  const stats = [
    { label: 'Receita em Execução', value: 'R$ 200.000', change: '+12%', icon: TrendingUp, color: 'emerald' },
    { label: 'Propostas em Aberto', value: '8', change: '3 urgentes', icon: FileText, color: 'blue' },
    { label: 'Mão de Obra Ativa', value: '14', change: '4 equipes', icon: Users, color: 'violet' },
    { label: 'Margem Média', value: '32%', change: '+2.4%', icon: Activity, color: 'orange' },
  ];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Escritório PrecificaPro</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Gestão consolidada de portfólio e performance por projeto.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate('/projects')} className="px-6 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">Ver Todas as Obras</button>
           <button onClick={() => navigate('/calculator')} className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
             <Plus size={16} /> Nova Obra
           </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            <p className="text-[10px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowUpRight size={12} /> {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Monitoramento de Obras Ativas */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
             <Hammer size={22} className="text-indigo-600" /> Saúde dos Projetos em Execução
           </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map(project => (
            <div key={project.id} onClick={() => navigate(`/projects`)} className="group bg-white dark:bg-gray-900 rounded-[40px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
               {project.status === 'warning' && (
                 <div className="absolute top-0 right-0 p-6">
                    <AlertTriangle className="text-rose-500 animate-pulse" size={24} />
                 </div>
               )}
               <div className="mb-6">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">{project.client}</p>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{project.name}</h3>
               </div>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Executado</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">R$ {project.spent.toLocaleString('pt-BR')}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</p>
                        <p className="text-sm font-bold text-gray-500">R$ {project.budget.toLocaleString('pt-BR')}</p>
                     </div>
                  </div>
                  
                  <div className="relative h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-1000 rounded-full ${project.spent > project.budget ? 'bg-rose-500' : 'bg-indigo-600'}`}
                        style={{ width: `${Math.min(project.progress, 100)}%` }}
                     />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                     <div className="flex items-center gap-2">
                        <PieChart size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{project.progress}% Concluído</span>
                     </div>
                     <ChevronRight size={18} className="text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-gray-900 rounded-[40px] p-8 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2"><FileText size={20} className="text-blue-500"/> Propostas Vinculadas</h3>
               <button onClick={() => navigate('/proposals')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver Todas</button>
            </div>
            <div className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-transparent hover:border-blue-100 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">#0{i}</div>
                       <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">Proposta Automação Residencial</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Projeto: Residência Alphaville</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-blue-600">R$ 15.000</p>
                       <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Enviada</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900 rounded-[40px] p-8 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2"><Calculator size={20} className="text-emerald-500"/> Precificações Recentes</h3>
               <button onClick={() => navigate('/calculator')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Nova Calculadora</button>
            </div>
            <div className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-transparent hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Calculator size={18}/></div>
                       <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">Estimativa de Custos Mão de Obra</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Válido por 15 dias</p>
                       </div>
                    </div>
                    <button onClick={() => navigate('/calculator')} className="p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-gray-400 hover:text-emerald-600 transition-all"><ArrowUpRight size={18}/></button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
