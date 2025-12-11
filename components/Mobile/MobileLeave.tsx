
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Camera, FileText, CheckCircle, Clock, XCircle, Upload } from 'lucide-react';
import { LeaveStatus } from '../../types';

const MobileLeave: React.FC = () => {
  const { currentUser, leaves, addLeaveRequest, t } = useApp();
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');
  
  // Form State
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Simulate API delay
    setTimeout(() => {
      addLeaveRequest({
        id: `L-${Date.now()}`,
        employeeId: currentUser.id,
        type: leaveType,
        startDate,
        endDate,
        reason,
        status: LeaveStatus.PENDING,
        approverLevel: 1
      });
      // Reset form
      setReason('');
      setStartDate('');
      setEndDate('');
      setHasFile(false);
      setSubmitted(false);
      setActiveTab('history');
    }, 1500);
  };

  const myLeaves = leaves.filter(l => l.employeeId === currentUser.id);

  const getStatusColor = (status: LeaveStatus) => {
    switch(status) {
      case LeaveStatus.APPROVED: return 'text-green-600 bg-green-50 border-green-200';
      case LeaveStatus.REJECTED: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch(status) {
      case LeaveStatus.APPROVED: return <CheckCircle size={16} />;
      case LeaveStatus.REJECTED: return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-4 border border-slate-100">
        <button 
          onClick={() => setActiveTab('apply')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'apply' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          {t('leave.tab.new')}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          {t('leave.tab.history')}
        </button>
      </div>

      {activeTab === 'apply' ? (
        <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('leave.type')}</label>
            <select 
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-black"
            >
              <option value="Annual">{t('leave.type.Annual')}</option>
              <option value="Sick">{t('leave.type.Sick')}</option>
              <option value="Personal">{t('leave.type.Personal')}</option>
              <option value="Official">{t('leave.type.Official')}</option>
              <option value="Marriage">{t('leave.type.Marriage')}</option>
              <option value="Funeral">{t('leave.type.Funeral')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('leave.startDate')}</label>
              <input 
                type="date" 
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('leave.endDate')}</label>
              <input 
                type="date" 
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('leave.reason')}</label>
            <textarea 
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('leave.reasonph')}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-slate-900"
            ></textarea>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('leave.attach')}</label>
             <div 
               onClick={() => setHasFile(!hasFile)}
               className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                 hasFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:bg-slate-50'
               }`}
             >
                {hasFile ? (
                   <>
                     <CheckCircle className="text-green-500 mb-1" size={24} />
                     <span className="text-xs text-green-700 font-medium">medical_cert.jpg attached</span>
                   </>
                ) : (
                   <>
                     <div className="flex space-x-3 mb-2 text-slate-400">
                        <Camera size={20} />
                        <FileText size={20} />
                     </div>
                     <span className="text-xs text-slate-500">{t('leave.attach.sub')}</span>
                   </>
                )}
             </div>
          </div>

          <button 
            type="submit" 
            disabled={submitted}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-emerald-700"
          >
            {submitted ? (
               <span>{t('leave.submitting')}</span>
            ) : (
               <>
                 <Upload size={18} />
                 <span>{t('leave.submit')}</span>
               </>
            )}
          </button>
        </form>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {myLeaves.length > 0 ? myLeaves.map(leave => (
            <div key={leave.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-slate-800">{t(`leave.type.${leave.type}`)}</h3>
                    <p className="text-xs text-slate-500">{leave.startDate} to {leave.endDate}</p>
                 </div>
                 <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(leave.status)}`}>
                    {getStatusIcon(leave.status)}
                    <span>{leave.status}</span>
                 </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                "{leave.reason}"
              </p>
              {leave.status === 'Pending' && (
                 <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                    <span>{t('leave.waiting')}</span>
                 </div>
              )}
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
               <FileText size={48} className="mb-2 opacity-20" />
               <p className="text-sm">{t('leave.noHistory')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileLeave;
