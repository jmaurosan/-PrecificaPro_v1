
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Info, Save, RotateCcw, ChevronRight, 
  Calculator, Hammer, CheckCircle2, X 
} from 'lucide-react';

interface CalculatorItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  profitMargin: number;
}

const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('Apartamento Granja Viana');
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: '1', description: 'Instalação de Pontos de Automação', quantity: 12, unitCost: 150, profitMargin: 35 },
    { id: '2', description: 'Central de Processamento', quantity: 1, unitCost: 2500, profitMargin: 20 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitCost: 0, profitMargin: 30 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CalculatorItem, value: number | string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const cost = item.quantity * item.unitCost;
      return sum + (cost * (1 + item.profitMargin / 100));
    }, 0);
  };

  const handleSaveToProject = () => {
    // Simulação de salvamento
    alert(`Orçamento de R$ ${calculateTotal().toLocaleString('pt-BR')} vinculado à obra ${selectedProject}!`);
    setShowSaveModal(false);
    navigate('/projects');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Calculadora de Custos</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Composição de preço de venda com markup dinâmico.</p>
        </div>
        <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Save size={18} /> Salvar no Projeto
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-10 space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-transparent hover:border-emerald-100 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-5 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição do Item / Serviço</label>
                  <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="w-full bg-transparent font-bold text-gray-900 dark:text-white focus:outline-none text-lg" placeholder="Ex: Mão de Obra Elétrica..." />
                </div>
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quant.</label>
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-900 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-center" />
                </div>
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custo Unit.</label>
                  <input type="number" value={item.unitCost} onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-900 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold" />
                </div>
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Margem (%)</label>
                  <input type="number" value={item.profitMargin} onChange={(e) => updateItem(item.id, 'profitMargin', parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-900 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-center text-emerald-600" />
                </div>
                <button onClick={() => removeItem(item.id)} className="p-3 text-gray-300 hover:text-rose-500 transition-all"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>

          <button onClick={addItem} className="w-full py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center justify-center gap-2">
             <Plus size={18} /> Adicionar Novo Item à Tabela
          </button>
        </div>

        <div className="p-10 bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><Calculator size={32}/></div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Preço de Venda Sugerido</p>
                 <h3 className="text-4xl font-black tracking-tighter">R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
              </div>
           </div>
           <button onClick={() => setShowSaveModal(true)} className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
             Vincular à Obra <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {/* Modal Salvar no Projeto */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-950 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
             <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Vincular Orçamento</h2>
                <button onClick={() => setShowSaveModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"><X size={20} /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Hammer size={12}/> Selecione a Obra Destino</label>
                   <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="w-full px-5 py-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl font-black text-indigo-600 outline-none">
                      <option>Apartamento Granja Viana</option>
                      <option>Residência Alphaville</option>
                      <option>Loja Shopping Center</option>
                   </select>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-1 text-center">Valor a ser Transmitido</p>
                   <p className="text-2xl font-black text-gray-900 dark:text-white text-center">R$ {calculateTotal().toLocaleString('pt-BR')}</p>
                </div>
                <button onClick={handleSaveToProject} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                   <CheckCircle2 size={18} /> Confirmar Vínculo
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;
