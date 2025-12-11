
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { LeaveStatus, Employee } from '../../types';
import { CheckCircle, XCircle, FileText, Settings, User, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeaveList: React.FC = () => {
  const { leaves, employees, updateLeaveStatus, t, attendance } = useApp();
  const [activeTab, setActiveTab] = useState<'requests' | 'overtime' | 'settings'>('requests');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  // Mock data for Settings Tab
  const [approvers, setApprovers] = useState<Record<string, { l1: string, l2: string, l3: string }>>(() => {
    const initial: any = {};
    employees.forEach(e => {
       initial[e.id] = { l1: 'E001', l2: '', l3: '' };
    });
    return initial;
  });

  const handleAction = (id: string, status: LeaveStatus) => {
    updateLeaveStatus(id, status);
    if (status === LeaveStatus.APPROVED) {
        setSelectedLeaveId(id);
        setShowApproveModal(true);
    }
  };

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || id;
  const getEmployeeAvatar = (id: string) => employees.find(e => e.id === id)?.avatar;

  // Mock logic to find overtime records
  const overtimeRecords = attendance.filter(r => {
      // Mock condition: Late check-in or simple random logic for demo
      // In real app, calculate actual hours vs shift hours
      return r.status === 'Late' || (r.checkIn && r.checkOut && parseInt(r.checkOut) - parseInt(r.checkIn) > 9);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t('leave.mgr.title')}</h2>
        
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('requests')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'requests' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             {t('leave.mgr.tab.requests')}
           </button>
           <button 
             onClick={() => setActiveTab('overtime')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'overtime' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             {t('leave.mgr.tab.overtime')}
           </button>
           <button 
             onClick={() => setActiveTab('settings')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'settings' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             {t('leave.mgr.tab.settings')}
           </button>
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">{t('leave.mgr.col.applicant')}</th>
                <th className="px-6 py-4">{t('leave.mgr.col.type')}</th>
                <th className="px-6 py-4">{t('leave.mgr.col.duration')}</th>
                <th className="px-6 py-4">{t('leave.mgr.col.reason')}</th>
                <th className="px-6 py-4">{t('leave.mgr.col.status')}</th>
                <th className="px-6 py-4 text-right">{t('leave.mgr.col.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                     <div className="flex items-center space-x-3">
                        <img src={getEmployeeAvatar(leave.employeeId)} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-slate-700">{getEmployeeName(leave.employeeId)}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold">
                        {t(`leave.type.${leave.type}`)}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                     <div>{leave.startDate}</div>
                     <div className="text-xs text-slate-400">to {leave.endDate}</div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-slate-700 mb-1">{leave.reason}</p>
                     <button className="flex items-center space-x-1 text-xs text-emerald-500 hover:underline">
                        <FileText size={12} />
                        <span>{t('leave.mgr.attachment')}</span>
                     </button>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit space-x-1 ${
                        leave.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-700' :
                        leave.status === LeaveStatus.REJECTED ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                     }`}>
                        {leave.status === LeaveStatus.APPROVED && <CheckCircle size={12} />}
                        {leave.status === LeaveStatus.REJECTED && <XCircle size={12} />}
                        <span>{leave.status}</span>
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     {leave.status === LeaveStatus.PENDING && (
                        <div className="flex justify-end space-x-2">
                           <button 
                             onClick={() => handleAction(leave.id, LeaveStatus.APPROVED)}
                             className="p-1 text-green-600 hover:bg-green-50 rounded"
                             title={t('leave.mgr.approve')}
                           >
                              <CheckCircle size={20} />
                           </button>
                           <button 
                             onClick={() => handleAction(leave.id, LeaveStatus.REJECTED)}
                             className="p-1 text-red-600 hover:bg-red-50 rounded"
                             title={t('leave.mgr.reject')}
                           >
                              <XCircle size={20} />
                           </button>
                        </div>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'overtime' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-yellow-50 border-b border-yellow-100 text-sm text-yellow-800 flex items-start space-x-2">
               <FileText size={18} className="shrink-0" />
               <p>According to regulations, overtime application forms are not required. This list shows attendance records exceeding shift hours for your review.</p>
            </div>
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">{t('leave.mgr.col.applicant')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.ot.date')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.ot.hours')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.ot.type')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.ot.status')}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {overtimeRecords.map(rec => (
                     <tr key={rec.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-700">
                           {getEmployeeName(rec.employeeId)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{rec.date}</td>
                        <td className="px-6 py-4 font-mono font-bold text-red-500">
                           +1.5h
                        </td>
                        <td className="px-6 py-4">
                           {/* Simulate user choice from MobileSchedule */}
                           <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-bold border border-purple-100">
                              {Math.random() > 0.5 ? t('sched.payOt') : t('sched.compLeave')}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                           {rec.status === 'Late' ? 'Late Arrival' : 'Extended Shift'}
                        </td>
                     </tr>
                  ))}
                  {overtimeRecords.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                           No overtime records found for this period.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      )}

      {activeTab === 'settings' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4">{t('leave.mgr.col.applicant')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.set.level1')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.set.level2')}</th>
                     <th className="px-6 py-4">{t('leave.mgr.set.level3')}</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {employees.filter(e => e.role === 'EMPLOYEE').map(emp => (
                     <tr key={emp.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-700 flex items-center space-x-2">
                           <img src={emp.avatar} className="w-6 h-6 rounded-full" alt="" />
                           <span>{emp.name}</span>
                        </td>
                        {[1, 2, 3].map(level => (
                           <td key={level} className="px-6 py-4">
                              <select className="bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 outline-none w-full max-w-[150px] text-black">
                                 <option value="">--</option>
                                 {employees.filter(m => m.role === 'ADMIN').map(mgr => (
                                    <option key={mgr.id} value={mgr.id} selected={level === 1 && mgr.id === 'E001'}>
                                       {mgr.name}
                                    </option>
                                 ))}
                              </select>
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {/* Approval Modal */}
      {showApproveModal && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center space-y-4">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-800">{t('leave.mgr.modal.title')}</h3>
               <p className="text-slate-500 text-sm">{t('leave.mgr.modal.desc')}</p>
               
               <div className="space-y-2 pt-2 text-left">
                  <label className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                     <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" defaultChecked />
                     <span className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                        <MessageCircle size={16} className="text-green-500" />
                        <span>{t('leave.mgr.modal.notify')}</span>
                     </span>
                  </label>
                  <Link to="/admin/schedule" className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                     <Calendar size={18} className="text-emerald-500" />
                     <span className="text-sm font-medium">{t('leave.mgr.modal.shift')}</span>
                  </Link>
               </div>

               <button 
                 onClick={() => setShowApproveModal(false)}
                 className="w-full bg-emerald-900 text-white py-2 rounded-lg font-bold hover:bg-emerald-800 transition"
               >
                  OK
               </button>
            </div>
         </div>
      )}

    </div>
  );
};

export default LeaveList;
