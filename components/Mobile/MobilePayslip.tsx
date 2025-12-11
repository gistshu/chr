
import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { Lock, Download } from 'lucide-react';
import { PayrollRecord } from '../../types';

const MobilePayslip: React.FC = () => {
  const { currentUser, t, generatePayroll } = useApp();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [record, setRecord] = useState<PayrollRecord | null>(null);

  // Simulate fetching current month's payroll record
  useEffect(() => {
      const month = '2023-10'; // Mock current month
      const records = generatePayroll(month);
      const myRecord = records.find(r => r.employeeId === currentUser.id);
      setRecord(myRecord || null);
  }, [currentUser, generatePayroll]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '0000') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError(t('pay.error'));
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <Lock size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">{t('pay.secure')}</h2>
          <p className="text-sm text-slate-500 mt-1">{t('pay.enterPin')}</p>
        </div>
        
        <form onSubmit={handleUnlock} className="w-full max-w-[240px] space-y-4">
          <input 
            type="password" 
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-2xl tracking-[0.5em] py-3 border-b-2 border-slate-300 focus:border-emerald-500 focus:outline-none bg-transparent transition-colors text-slate-900"
            placeholder="••••"
            autoFocus
          />
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 active:scale-95 transition-transform hover:bg-emerald-700"
          >
            {t('pay.unlock')}
          </button>
        </form>
      </div>
    );
  }

  if (!record) return <div className="p-4 text-center text-slate-500">Loading payroll data...</div>;

  return (
    <div className="space-y-4 pb-6">
      <div className="flex justify-between items-end px-1">
          <h2 className="text-xl font-bold text-slate-900">{t('nav.payslip')}</h2>
          <span className="text-sm font-bold text-slate-500 font-mono">2023-10</span>
      </div>

      {/* Net Pay Banner */}
      <div className="bg-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
         <div className="relative z-10">
            <div className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">{t('pay.totalNet')}</div>
            <div className="text-4xl font-mono font-bold">${record.netSalary.toLocaleString()}</div>
            <div className="mt-3 text-xs opacity-90 border-t border-emerald-500 pt-2 flex justify-between font-mono">
                <span>{t('reg.gross')}: {record.grossSalary.toLocaleString()}</span>
                <span>{t('reg.totalDed')}: -{record.totalDeductions.toLocaleString()}</span>
            </div>
         </div>
         {/* Decor */}
         <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500 rounded-full opacity-50 blur-xl"></div>
      </div>

      {/* Section A: Fixed */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="bg-slate-100 p-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">{t('pay.col.A')}</h3>
         </div>
         <div className="p-4 space-y-3">
            <Row label={t('pay.item.base')} value={record.baseSalary} />
            <Row label={t('pay.item.meal')} value={record.mealAllowance} />
            <Row label={t('pay.item.fullAtt')} value={record.fullAttendanceBonus} />
            <Row label={t('pay.item.job')} value={record.jobAllowance} />
            <Subtotal label={`${t('pay.subtotal')} A`} value={record.subtotalA} />
         </div>
      </div>

      {/* Section B: Variable */}
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
         <div className="bg-emerald-50 p-3 border-b border-emerald-100">
            <h3 className="font-bold text-emerald-900 text-sm">{t('pay.col.B')}</h3>
         </div>
         <div className="p-4 space-y-3">
            <Row label={t('pay.item.wdOt')} value={record.weekdayOvertimePay} />
            <Row label={t('pay.item.rdOt')} value={record.restDayOvertimePay} />
            <Row label={t('pay.item.holOt')} value={record.holidayOvertimePay} />
            <Row label={t('pay.item.annual')} value={record.unusedAnnualLeavePay} />
            <Row label={t('reg.bonus')} value={record.otherBonuses} />
            <Row label={t('reg.transport')} value={record.transportAllowance} />
            <Subtotal label={`${t('pay.subtotal')} B`} value={record.subtotalB} color="text-emerald-700" />
         </div>
      </div>

      {/* Section C: Deductions */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
         <div className="bg-red-50 p-3 border-b border-red-100">
            <h3 className="font-bold text-red-900 text-sm">{t('pay.col.C')}</h3>
         </div>
         <div className="p-4 space-y-3">
            <Row label={t('pay.item.labor')} value={record.laborInsurance} isDed />
            <Row label={t('pay.item.health')} value={record.healthInsurance} isDed />
            <Row label={t('pay.item.pension')} value={record.pension} isDed />
            <Row label={t('pay.item.welfare')} value={record.welfareFund} isDed />
            <Row label={t('pay.item.tax')} value={record.tax} isDed />
            <Row label={t('pay.item.sickDed')} value={record.sickLeaveDeduction} isDed />
            <Row label={t('pay.item.persDed')} value={record.personalLeaveDeduction} isDed />
            <Subtotal label={`${t('pay.subtotal')} C`} value={record.subtotalC} isDed color="text-red-700" />
         </div>
      </div>

      <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform">
         <Download size={18} />
         <span>{t('pay.download')}</span>
      </button>
    </div>
  );
};

const Row = ({ label, value, isDed }: { label: string, value: number, isDed?: boolean }) => {
   if (value === 0) return null;
   return (
      <div className="flex justify-between text-sm items-center">
         <span className="text-slate-600">{label}</span>
         <span className={`font-mono font-medium ${isDed ? 'text-red-600' : 'text-slate-900'}`}>
            {isDed ? '-' : ''}{value.toLocaleString()}
         </span>
      </div>
   );
};

const Subtotal = ({ label, value, isDed, color = 'text-slate-900' }: any) => (
   <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm items-center mt-1">
      <span className="text-slate-800">{label}</span>
      <span className={`font-mono text-base ${color}`}>
         {isDed ? '-' : ''}{value.toLocaleString()}
      </span>
   </div>
);

export default MobilePayslip;
