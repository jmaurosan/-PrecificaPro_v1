
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, ArrowLeft, DollarSign, Calendar, MapPin, 
  Trash2, Search, X, CheckCircle2, ShoppingCart, 
  Camera, FileText, AlertTriangle, Receipt, Hash,
  ChevronDown, ArrowUpCircle, ArrowDownCircle, Filter, FilterX
} from 'lucide-react';
import { Project, ProjectExpense } from '../types';

const ProjectFinances: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Dados Simulados do Projeto Selecionado
  const [project, setProject] = useState<Project>({
    id: id || 'p1',
    name: 'Apartamento Granja Viana',
    clientId: 'c1',
    clientName: 'Mauro Silva',
    totalBudget: 45000,
    spentAmount: 12450.00,
    startDate: '2024-03-15',
    status: 'active'
  });

  const [expenses, setExpenses] = useState<ProjectExpense[]>([
    {
      id: 'exp1',
      projectId: 'p1',
      description: 'Cimento e Areia (Material de Construção)',
      location: 'Leroy Merlin',
      quantity: 10,
      unitValue: 35.00,
      totalValue: 350.00,
      date: '2024-05-20',
      type: 'expense'
    },
    {
      id: 'exp2',
      projectId: 'p1',
      description: 'Tubulação PVC Tigre',
      location: 'Hidráulica Paulista',
      quantity: 5,
      unitValue: 80.00,
      totalValue: 400.00,
      date: '2024-05-18',
      type: 'expense'
    }
  ]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<ProjectExpense>>({
    description: '',
    location: '',
    quantity: 1,
    unitValue: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  // Cálculos de Budget
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.totalValue, 0), [expenses]);
  const balance = project.totalBudget - totalSpent;
  const balancePercent = (balance / project.totalBudget) * 100;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const totalValue = (formData.quantity || 0) * (formData.unitValue || 0);
    
    const newExpense: ProjectExpense = {
      id: `exp-${Date.now()}`,
      projectId: project.id,
      description: formData.description || '',
      location: formData.location || '',
      quantity: formData.quantity || 1,
      unitValue: formData.unitValue || 0,
      totalValue: totalValue,
      date: formData.date || '',
      type: formData.type as 'expense' | 'return',
      receiptImage: receiptPreview || undefined
    };

    setExpenses([newExpense, ...expenses]);
    setShowFormModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      location: '',
      quantity: 1,
      unitValue: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    });
    setReceiptPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header com Navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest mb-2"
          >
            <ArrowLeft size={16} /> Voltar para Projetos
          </button>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Gestão Financeira: {project.name}</h1>
          <p className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
            <Hash size={14} className="text-emerald-500" /> ID do Projeto: {project.id}
          </p>
        </div>
        <button 
          onClick={() => setShowFormModal(true)}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
        >
          <Plus size={20} /> Lançar Nova Despesa
        </button>
      </div>

      {/* Dashboard de Budget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget Total da Obra</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">R$ {project.totalBudget.toLocaleString('pt-BR')}</p>
          <div className="absolute top-4 right-4 text-emerald-100 dark:text-emerald-900/30">
            <DollarSign size={48} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Lançado (Gasto)</p>
          <p className="text-3xl font-black text-rose-600">R$ {totalSpent.toLocaleString('pt-BR')}</p>
          <div className="absolute top-4 right-4 text-rose-100 dark:text-rose-900/30">
            <ArrowDownCircle size={48} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-1">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo Disponível</p>
             <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${balancePercent < 15 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {balancePercent.toFixed(1)}% Restante
             </span>
          </div>
          <p className={`text-3xl font-black transition-colors ${balance < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
            R$ {balance.toLocaleString('pt-BR')}
          </p>
          <div className="mt-4 h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
             <div 
                className={`h-full transition-all duration-700 ${balancePercent < 15 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(0, Math.min(balancePercent, 100))}%` }}
             />
          </div>
        </div>
      </div>

      {/* Seção de Lançamentos */}
      <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Extrato de Lançamentos</h2>
              <div className="hidden sm:flex gap-1">
                 <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[8px] font-black uppercase text-gray-400">Total: {expenses.length} itens</span>
              </div>
           </div>
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Filtrar por item ou fornecedor..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item / Descrição</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quant.</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Unitário</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Total</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all group">
                  <td className="px-8 py-6 text-xs font-black text-gray-500 tabular-nums">
                    {new Date(expense.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{expense.description}</p>
                      <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {expense.location}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-xs font-bold text-gray-600 dark:text-gray-400">
                    {expense.quantity} un
                  </td>
                  <td className="px-8 py-6 text-right text-xs font-bold text-gray-500">
                    R$ {expense.unitValue.toLocaleString('pt-BR')}
                  </td>
                  <td className={`px-8 py-6 text-right font-black text-sm ${expense.type === 'return' ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                    {expense.type === 'return' ? '+' : '-'} R$ {expense.totalValue.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {expense.receiptImage ? (
                      <button className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:scale-110 transition-transform">
                        <Receipt size={18} />
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-gray-300 uppercase italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <Search className="text-gray-200" size={48} />
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nenhum lançamento encontrado</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Lançamento */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 my-8">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Plus size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Lançar Despesa</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Obra: {project.name}</p>
                 </div>
              </div>
              <button onClick={() => { setShowFormModal(false); resetForm(); }} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddExpense} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição do Item</label>
                <input 
                   required
                   type="text" 
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none focus:border-emerald-500"
                   placeholder="Ex: 50 sacos de cimento CP-II" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local de Aquisição</label>
                    <input 
                      required
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none"
                      placeholder="Ex: Leroy Merlin" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data da Compra</label>
                    <input 
                      required
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantidade</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-center" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">V. Unitário (R$)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={formData.unitValue}
                      onChange={(e) => setFormData({...formData, unitValue: parseFloat(e.target.value) || 0})}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-bold outline-none text-center" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total (R$)</label>
                    <div className="w-full px-5 py-3.5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl font-black text-emerald-600 text-center">
                       {((formData.quantity || 0) * (formData.unitValue || 0)).toLocaleString('pt-BR')}
                    </div>
                 </div>
              </div>

              {/* Anexo de Recibo */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Anexar Comprovante / Recibo</label>
                <div className="relative group">
                   <div className="w-full h-32 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center transition-all group-hover:border-emerald-500 overflow-hidden">
                      {receiptPreview ? (
                        <div className="relative w-full h-full">
                           <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover" />
                           <button 
                              type="button"
                              onClick={() => setReceiptPreview(null)}
                              className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg"
                           >
                              <X size={14} />
                           </button>
                        </div>
                      ) : (
                        <>
                           <Camera className="text-gray-300 mb-2" size={32} />
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Clique para fotografar ou subir arquivo</p>
                        </>
                      )}
                      <input 
                         type="file" 
                         accept="image/*"
                         onChange={handleFileChange}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                   </div>
                </div>
              </div>

              {balance < ((formData.quantity || 0) * (formData.unitValue || 0)) && (
                 <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl">
                    <AlertTriangle className="text-rose-600 shrink-0" size={20} />
                    <div>
                       <p className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase">Atenção: Saldo Insuficiente</p>
                       <p className="text-[10px] font-medium text-rose-600/70">Este lançamento fará a obra ultrapassar o orçamento total planejado.</p>
                    </div>
                 </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setShowFormModal(false); resetForm(); }}
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                >
                  <CheckCircle2 size={18} /> Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFinances;
