
import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { User, Bell, Shield, Palette, Download, Upload, Monitor, Sun, Moon, Check } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    proposals: true,
    updates: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Configurações</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Personalize sua conta e as preferências do sistema.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
            saved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
          }`}
        >
          {saved ? <><Check size={18} /> Alterações Salvas</> : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <User size={20} className="text-emerald-500" />
              Informações do Perfil
            </h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-800 group-hover:border-emerald-500 transition-all overflow-hidden">
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-4xl">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 text-white rounded-xl shadow-lg border-2 border-white dark:border-gray-900 hover:scale-110 transition-all">
                  <Upload size={14} />
                </button>
              </div>
              <div>
                <p className="font-black text-gray-900 dark:text-white text-2xl">{user?.name || 'Usuário'}</p>
                <p className="text-gray-500 font-medium">Administrador da Conta</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome de Exibição</label>
                <input type="text" defaultValue={user?.name} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Endereço de Email</label>
                <input type="email" defaultValue={user?.email} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all font-bold" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sua Empresa / Agência</label>
                <input type="text" defaultValue={user?.company} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 dark:text-white transition-all font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Palette size={20} className="text-purple-500" />
              Preferências Visuais
            </h2>
          </div>
          <div className="p-8">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-widest">Tema da Interface</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                onClick={() => setTheme('light')}
                className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                  theme === 'light' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-xl shadow-emerald-100 dark:shadow-none' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <Sun size={32} className={theme === 'light' ? 'text-emerald-600' : 'text-gray-400'} />
                <p className={`font-bold ${theme === 'light' ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-500'}`}>Claro</p>
                {theme === 'light' && <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-950"></div>}
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                  theme === 'dark' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-xl shadow-emerald-100 dark:shadow-none' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <Moon size={32} className={theme === 'dark' ? 'text-emerald-600' : 'text-gray-400'} />
                <p className={`font-bold ${theme === 'dark' ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-500'}`}>Escuro</p>
                {theme === 'dark' && <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-950"></div>}
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                  theme === 'system' 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-xl shadow-emerald-100 dark:shadow-none' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <Monitor size={32} className={theme === 'system' ? 'text-emerald-600' : 'text-gray-400'} />
                <p className={`font-bold ${theme === 'system' ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-500'}`}>Automático</p>
                {theme === 'system' && <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-950"></div>}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
           <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell size={20} className="text-amber-500" />
              Notificações
            </h2>
          </div>
          <div className="p-8 space-y-6">
            {[
              { key: 'email', label: 'Resumo Semanal por Email', description: 'Receba um relatório de performance toda segunda-feira.' },
              { key: 'proposals', label: 'Alertas de Propostas', description: 'Notificar quando um cliente visualizar ou aceitar um orçamento.' },
              { key: 'updates', label: 'Novidades do PrecificaPro', description: 'Fique por dentro das novas funcionalidades e melhorias.' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-2xl transition-all">
                <div className="flex-1 pr-4">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{item.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.description}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                    notifications[item.key as keyof typeof notifications] 
                      ? 'bg-emerald-500' 
                      : 'bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Security Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
           <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield size={20} className="text-blue-500" />
              Segurança e Dados
            </h2>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
               <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500">
                  <Download size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Exportar Base de Dados</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Baixe todas as suas propostas, clientes e serviços em formato JSON.</p>
                  <button className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
                    Baixar Backup
                  </button>
               </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
               <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-blue-500">
                  <Upload size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Importar Dados</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Restaure sua conta a partir de um arquivo de backup do PrecificaPro.</p>
                  <button className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
                    Selecionar Arquivo
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
