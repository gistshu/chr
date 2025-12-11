
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Lock, ArrowRight, Globe } from 'lucide-react';
import { useApp } from '../AppContext';
import { Language } from '../types';

const Login: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
       setLoading(false);
       navigate('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 -z-10"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-50"></div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
         <div className="flex bg-white/80 backdrop-blur rounded-lg shadow-sm p-1">
             {(['en', 'zh', 'ja'] as Language[]).map(lang => (
                 <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${language === lang ? 'bg-emerald-600 text-white' : 'text-emerald-700/60 hover:text-emerald-700'}`}
                 >
                    {lang === 'en' ? 'EN' : lang === 'zh' ? '繁中' : 'JP'}
                 </button>
             ))}
         </div>
      </div>

      <div className="w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-4 transform rotate-3">
              <Activity size={32} className="text-white" />
           </div>
           <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">HR Lite</h1>
           <p className="text-emerald-600/80 text-sm mt-1">Clinic Operation System</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl shadow-emerald-100/50 overflow-hidden border border-emerald-50">
           <div className="p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">{t('login.welcome')}</h2>
              <p className="text-slate-500 text-sm mb-6">{t('login.subtitle')}</p>

              <form onSubmit={handleLogin} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase ml-1">{t('login.account')}</label>
                    <div className="relative group">
                       <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                       <input 
                         type="text" 
                         value={account}
                         onChange={(e) => setAccount(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                         placeholder="E001"
                       />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase ml-1">{t('login.password')}</label>
                    <div className="relative group">
                       <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                         placeholder="••••••••"
                       />
                    </div>
                 </div>
                 
                 <div className="flex justify-end pt-1">
                    <button type="button" className="text-xs text-emerald-600 hover:text-emerald-800 hover:underline">
                       {t('login.forgot')}
                    </button>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2 active:scale-95 shadow-lg shadow-emerald-200"
                 >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                           <span>{t('login.btn')}</span>
                           <ArrowRight size={16} />
                        </>
                    )}
                 </button>
              </form>
           </div>
           
           <div className="bg-emerald-50/50 px-8 py-4 border-t border-emerald-50 flex justify-center">
              <p className="text-xs text-emerald-600/60">Demo Account: admin / admin</p>
           </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
           <p className="text-xs text-emerald-800/40 font-medium">{t('login.developer')}</p>
           <div className="text-[10px] text-emerald-700/30 flex items-center justify-center space-x-2">
              <span>{t('login.copyright')}</span>
              <span>|</span>
              <a href="#" className="hover:text-emerald-600">{t('login.privacy')}</a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
