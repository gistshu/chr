
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, FileText, User, Globe } from 'lucide-react';
import { useApp } from '../../AppContext';
import { Language } from '../../types';

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, t, language, setLanguage } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  // Simulating LINE's rich menu or bottom navigation
  const navItems = [
    { name: t('nav.home'), icon: <Home size={24} />, path: '/mobile' },
    { name: t('nav.checkin'), icon: <Clock size={24} />, path: '/mobile/checkin' },
    { name: t('nav.schedule'), icon: <Calendar size={24} />, path: '/mobile/schedule' },
    { name: t('nav.leave'), icon: <FileText size={24} />, path: '/mobile/leave' },
    { name: t('nav.payslip'), icon: <User size={24} />, path: '/mobile/payslip' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* LINE-like Header (Green) */}
        <header className="h-14 bg-emerald-700 text-white flex items-center px-4 shrink-0 z-20 relative shadow-sm">
          <h1 className="text-lg font-bold flex-1">HR Lite Bot</h1>
          
          <div className="flex items-center space-x-3">
             {/* Simple Lang Switcher for Mobile */}
             <button onClick={() => setLangOpen(!langOpen)} className="p-1 rounded hover:bg-white/10">
                <Globe size={20} />
             </button>
             <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-300">
                <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
             </div>
          </div>

          {/* Lang Dropdown */}
          {langOpen && (
            <div className="absolute top-12 right-4 bg-white text-slate-800 shadow-xl rounded-lg py-2 z-50 w-32 border border-slate-200">
              {(['en', 'zh', 'ja'] as Language[]).map(lang => (
                <button
                   key={lang}
                   onClick={() => { setLanguage(lang); setLangOpen(false); }}
                   className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 ${language === lang ? 'font-bold text-emerald-600 bg-emerald-50' : ''}`}
                >
                  {lang === 'en' ? 'English' : lang === 'zh' ? '繁體中文' : '日本語'}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-emerald-50 relative">
          {/* Background pattern simulation */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10 p-4 h-full flex flex-col">
             {children}
          </div>
        </main>

        {/* Bottom Navigation (Rich Menu Simulation) */}
        <nav className="bg-white border-t border-gray-200 pb-safe shrink-0 z-20">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileLayout;
