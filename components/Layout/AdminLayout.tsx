
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, DollarSign, Menu, Bell, Search, Settings, Globe } from 'lucide-react';
import { useApp } from '../../AppContext';
import { Language } from '../../types';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { t, language, setLanguage } = useApp();

  const menuItems = [
    { name: t('menu.dashboard'), icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: t('menu.schedule'), icon: <Calendar size={20} />, path: '/admin/schedule' },
    { name: t('menu.attendance'), icon: <FileText size={20} />, path: '/admin/attendance' },
    { name: t('menu.leaves'), icon: <Bell size={20} />, path: '/admin/leaves' },
    { name: t('menu.payroll'), icon: <DollarSign size={20} />, path: '/admin/payroll' },
    { name: t('menu.employees'), icon: <Users size={20} />, path: '/admin/employees' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar - Deep Green Theme */}
      <aside className={`bg-emerald-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20 shadow-xl`}>
        <div className="h-16 flex items-center justify-center border-b border-emerald-800/50">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-200">HR Lite Admin</h1>
          ) : (
            <span className="text-xl font-bold text-emerald-400">HR</span>
          )}
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                      : 'text-emerald-100/60 hover:bg-emerald-800 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Switcher */}
        {sidebarOpen && (
          <div className="px-4 py-2 mx-3 mb-2 bg-emerald-800 rounded-lg flex justify-around">
            {(['en', 'zh', 'ja'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`text-xs font-bold px-2 py-1 rounded ${language === lang ? 'bg-emerald-600 text-white' : 'text-emerald-300 hover:text-white'}`}
              >
                {lang === 'en' ? 'EN' : lang === 'zh' ? '繁中' : 'JP'}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-emerald-800">
           <Link to="/mobile" target="_blank" className="flex items-center text-sm text-emerald-300 hover:text-white">
              <Settings size={20} />
              {sidebarOpen && <span className="ml-3">{t('menu.openMobile')}</span>}
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-emerald-600">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
            <div className="flex items-center space-x-2">
              <img src="https://picsum.photos/id/64/40/40" alt="Admin" className="w-8 h-8 rounded-full border border-slate-200" />
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Dr. Sarah Chen</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
