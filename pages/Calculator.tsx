
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Info, Save, RotateCcw, ChevronRight, Calculator } from 'lucide-react';

interface CalculatorItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  profitMargin: number;
}

const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: '1', description: 'Horas de trabalho especializadas', quantity: 10, unitCost: 150, profitMargin: 40 },
    { id: '2', description: 'Infraestrutura e Ferramentas', quantity: 1, unitCost: 500, profitMargin: 20 },
  ]);

  const [showHelp, setShowHelp] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', quantity: 1, unitCost: 0, profitMargin: 30 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CalculatorItem, value: number | string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateItemTotal = (item: CalculatorItem) => {
    const cost = item.quantity * item.unitCost;
    const markup = cost * (item.profitMargin / 100);
    return cost + markup;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleGenerateProposal = () => {
    // Mapeia itens da calculadora para o formato de itens da proposta
    const proposalItems = items.map(item => ({
      id: `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      description: item.description || 'Item sem descrição',
      unit: 'un',
      quantity: item.quantity,
      // Preço Unitário na Proposta = Custo + Margem
      unitPrice: item.unitCost * (1 + item.profitMargin / 100)
    }));

    const pendingData = {
      items: proposalItems,
      total: calculateTotal(),
      notes: 'Gerado automaticamente a partir da Calculadora de Preços.'
    };

    // Salva temporariamente e navega
    localStorage.setItem('precificaPro_pending_proposal', JSON.stringify(pendingData));
    navigate('/proposals');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Calculadora de Preços</h1>
          <p className="text-gray-500 dark:text-gray-400">Calcule o preço de venda ideal com base nos seus custos e margem desejada.</p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={() => setShowHelp(!showHelp)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              showHelp ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Info size={18} />
            <span>Guia</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20">
            <Save size={18} />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 animate-in slide-in-from-top duration-300">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-2">Como utilizar a calculadora</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-blue-800 dark:text-blue-400">
                <div>
                  <p className="font-bold mb-1">1. Custo Unitário</p>
                  <p>Informe o valor que você gasta para produzir uma unidade ou realizar uma hora de trabalho.</p>
                </div>
                <div>
                  <p className="font-bold mb-1">2. Margem de Lucro (%)</p>
                  <p>A porcentagem que você deseja ganhar sobre o custo informado. É o seu lucro bruto.</p>
                </div>
                <div>
                  <p className="font-bold mb-1">3. Preço Final</p>
                  <p>O sistema calcula automaticamente o preço sugerido somando o custo e o lucro (markup).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Composição do Valor
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="group relative flex flex-col lg:flex-row gap-4 p-5 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição do Item</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Ex: Consultoria, Licenças, Impostos..."
                    className="w-full bg-transparent font-bold text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 text-lg"
                  />
                </div>
                
                <div className="flex flex-wrap items-end gap-6">
                  <div className="w-24 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantidade</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-gray-900 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-center font-bold outline-none"
                    />
                  </div>

                  <div className="w-32 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Custo Unitário</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                      <input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-gray-900 pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="w-28 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Margem (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={item.profitMargin}
                        onChange={(e) => updateItem(item.id, 'profitMargin', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-gray-900 pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-center font-bold outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>

                  <div className="w-32 text-right space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</label>
                    <p className="py-2.5 font-extrabold text-gray-900 dark:text-white">
                      R$ {calculateItemTotal(item).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={addItem}
              className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-emerald-600 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all font-bold group"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Adicionar Novo Item ao Cálculo</span>
            </button>
            <button
              onClick={() => setItems([{ id: '1', description: '', quantity: 1, unitCost: 0, profitMargin: 30 }])}
              className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Limpar Tudo"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-emerald-600 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Calculator size={32} />
               </div>
               <div>
                  <p className="text-emerald-50 font-black uppercase tracking-widest text-[10px]">Preço de Venda Sugerido</p>
                  <h3 className="text-4xl font-black tracking-tight">
                    R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
               </div>
            </div>
            <button 
              onClick={handleGenerateProposal}
              className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Gerar Proposta Comercial <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
