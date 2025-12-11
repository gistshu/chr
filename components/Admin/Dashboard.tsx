
import React from 'react';
import { Users, Clock, AlertCircle, TrendingUp, Smartphone, ArrowRight } from 'lucide-react';
import { useApp } from '../../AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { employees, attendance, leaves, t } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const presentCount = attendance.filter(a => a.date === today).length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  
  const stats = [
    { title: t('dash.totalEmp'), value: employees.length, icon: <Users className="text-emerald-600" />, color: 'bg-emerald-100' },
    { title: t('dash.present'), value: presentCount, icon: <Clock className="text-teal-600" />, color: 'bg-teal-100' },
    { title: t('dash.pending'), value: pendingLeaves, icon: <AlertCircle className="text-orange-600" />, color: 'bg-orange-100' },
    { title: t('dash.otHours'), value: '46h', icon: <TrendingUp className="text-green-600" />, color: 'bg-green-100' },
  ];

  const chartData = [
    { name: 'Week 1', hours: 40 },
    { name: 'Week 2', hours: 42 },
    { name: 'Week 3', hours: 38 },
    { name: 'Week 4', hours: 45 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-800">{t('dash.title')}</h2>
        
        {/* Demo Switcher */}
        <Link to="/mobile" className="group flex items-center space-x-2 bg-emerald-800 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
           <Smartphone size={18} />
           <span className="text-sm font-medium">{t('menu.openMobile')}</span>
           <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t('dash.weeklyHours')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t('dash.pendingApprovals')}</h3>
          <div className="space-y-4">
            {leaves.filter(l => l.status === 'Pending').slice(0, 3).map(leave => {
              const emp = employees.find(e => e.id === leave.employeeId);
              return (
                <div key={leave.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <img src={emp?.avatar} alt="" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{emp?.name}</p>
                    <p className="text-xs text-slate-500">{leave.type} • {leave.startDate}</p>
                    <div className="mt-2 flex space-x-2">
                       <button className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 transition">{t('dash.view')}</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {pendingLeaves === 0 && <p className="text-sm text-slate-400 text-center py-4">{t('dash.noPending')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
