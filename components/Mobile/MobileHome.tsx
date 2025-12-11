
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { useApp } from '../../AppContext';

const MobileHome: React.FC = () => {
  const { currentUser, t } = useApp();

  const menuButtons = [
    { label: t('home.btn.checkin'), icon: <Clock size={24} />, path: '/mobile/checkin', color: 'bg-emerald-500', desc: t('home.btn.checkin.desc') },
    { label: t('home.btn.schedule'), icon: <Calendar size={24} />, path: '/mobile/schedule', color: 'bg-teal-500', desc: t('home.btn.schedule.desc') },
    { label: t('home.btn.leave'), icon: <FileText size={24} />, path: '/mobile/leave', color: 'bg-orange-400', desc: t('home.btn.leave.desc') },
    { label: t('home.btn.payslip'), icon: <DollarSign size={24} />, path: '/mobile/payslip', color: 'bg-indigo-400', desc: t('home.btn.payslip.desc') },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Chat Simulation */}
      <div className="flex flex-col space-y-4">
        {/* System Message 1 */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-200 overflow-hidden shrink-0 border border-white">
             <img src="https://ui-avatars.com/api/?name=HR+Bot&background=059669&color=fff" alt="System" />
          </div>
          <div className="flex flex-col space-y-1 max-w-[85%]">
            <span className="text-xs text-slate-500 ml-1">HR Bot</span>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 border border-slate-100">
              <p>{t('home.greeting')} {currentUser.name}! 👋</p>
              <p className="mt-1">{t('home.help')}</p>
            </div>
          </div>
        </div>

        {/* System Message 2 */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-200 overflow-hidden shrink-0 border border-white">
             <img src="https://ui-avatars.com/api/?name=HR+Bot&background=059669&color=fff" alt="System" />
          </div>
          <div className="flex flex-col space-y-1 max-w-[85%]">
             <span className="text-xs text-slate-500 ml-1">HR Bot</span>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 border border-slate-100">
               <p>🔔 <strong>{t('home.reminder')}:</strong> {t('home.shiftReminder')} 08:00.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Spacer to push menu to bottom area */}
      <div className="flex-1"></div>

      {/* Rich Menu Simulation (Grid) */}
      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/40 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {menuButtons.map((btn, idx) => (
            <Link 
              key={idx} 
              to={btn.path} 
              className="flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-emerald-50"
            >
              <div className={`w-10 h-10 rounded-full ${btn.color} text-white flex items-center justify-center mb-2 shadow-sm`}>
                {btn.icon}
              </div>
              <span className="text-sm font-bold text-slate-700">{btn.label}</span>
              <span className="text-[10px] text-slate-400">{btn.desc}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="text-center pb-2">
         <Link to="/admin" className="text-[10px] text-emerald-600/70 underline hover:text-emerald-800">{t('home.switchToAdmin')}</Link>
      </div>
    </div>
  );
};

export default MobileHome;
