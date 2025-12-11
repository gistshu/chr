
import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { Lock, Search, Download, FileText, ChevronRight, X, DollarSign, Calculator, Save, Edit } from 'lucide-react';
import { PayrollRecord } from '../../types';

const Payroll: React.FC = () => {
  const { employees, generatePayroll, getPayrollHistory, calculatePayroll, updatePayrollRecord, t } = useApp();
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [selectedMonth, setSelectedMonth] = useState('2023-10');
  const [currentData, setCurrentData] = useState<PayrollRecord[]>([]);
  const [historyData, setHistoryData] = useState<PayrollRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'history' | 'calc'>('overview');
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  // Load data when month changes or tab changes
  useEffect(() => {
      if (!isLocked && (activeTab === 'overview' || activeTab === 'register')) {
          setCurrentData(generatePayroll(selectedMonth));
      }
  }, [selectedMonth, activeTab, isLocked]);

  // Handle History Search
  useEffect(() => {
      if (!isLocked && activeTab === 'history' && historySearch.length > 1) {
          const emp = employees.find(e => 
              e.id.toLowerCase().includes(historySearch.toLowerCase()) || 
              e.name.toLowerCase().includes(historySearch.toLowerCase())
          );
          if (emp) {
              setHistoryData(getPayrollHistory(emp.id));
          } else {
              setHistoryData([]);
          }
      }
  }, [historySearch, activeTab]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '8888') {
      setIsLocked(false);
      setError('');
      setCurrentData(generatePayroll(selectedMonth));
    } else {
      setError(t('pay.error'));
    }
  };

  const handleCalculate = () => {
      calculatePayroll(selectedMonth);
      setCurrentData(generatePayroll(selectedMonth));
  };

  const handleEditRecord = (record: PayrollRecord, field: keyof PayrollRecord, value: number) => {
      updatePayrollRecord(record.id, { [field]: value });
      // Update local selected record to reflect changes immediately in modal
      setSelectedRecord(prev => prev ? { ...prev, [field]: value } : null);
  };

  // --------------------------------------------------------------------------------
  // Render Components
  // --------------------------------------------------------------------------------

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md text-center space-y-6">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock size={40} />
           </div>
           <div>
              <h2 className="text-2xl font-bold text-slate-800">{t('payroll.locked')}</h2>
              <p className="text-slate-500 mt-2">{t('payroll.enterPass')}</p>
           </div>
           
           <form onSubmit={handleUnlock} className="space-y-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-center text-xl tracking-widest py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                placeholder="••••"
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button 
                type="submit"
                className="w-full bg-emerald-700 text-white py-3 rounded-lg font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-200"
              >
                 {t('payroll.unlock')}
              </button>
           </form>
           <p className="text-xs text-slate-400">Default Password: 8888</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('payroll.title')}</h2>
        
        <div className="flex items-center space-x-4">
           {/* Tab Switcher */}
           <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
              {(['overview', 'register', 'history', 'calc'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeTab === tab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                     {t(`payroll.tab.${tab}`)}
                  </button>
              ))}
           </div>
           
           <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">{t('payroll.month')}</span>
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none text-slate-700"
              />
           </div>
           <button onClick={() => setIsLocked(true)} className="text-slate-400 hover:text-red-500 transition" title="Lock">
              <Lock size={20} />
           </button>
        </div>
      </div>

      {/* 
        ========================================
        TAB: OVERVIEW
        ========================================
      */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('payroll.hist.search')} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64 bg-white text-slate-900 placeholder:text-slate-400"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
             </div>
           </div>
           <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
               <tr>
                  <th className="px-6 py-4">{t('payroll.col.emp')}</th>
                  <th className="px-6 py-4 text-right">{t('pay.col.A')}</th>
                  <th className="px-6 py-4 text-right">{t('pay.col.B')}</th>
                  <th className="px-6 py-4 text-right text-red-500">{t('pay.col.C')}</th>
                  <th className="px-6 py-4 text-right font-bold">{t('payroll.col.net')}</th>
                  <th className="px-6 py-4"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {currentData.filter(r => employees.find(e => e.id === r.employeeId)?.name.includes(searchTerm)).map(record => {
                 const emp = employees.find(e => e.id === record.employeeId);
                 return (
                   <tr key={record.id} className="hover:bg-slate-50 transition group">
                      <td className="px-6 py-4">
                         <div className="flex items-center space-x-3">
                            <img src={emp?.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                            <div>
                               <p className="font-bold text-slate-800">{emp?.name}</p>
                               <p className="text-xs text-slate-500">{emp?.jobTitle}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-600">{record.subtotalA.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono text-green-600">+{record.subtotalB.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono text-red-500">-{record.subtotalC.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-800 text-base">{record.netSalary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setSelectedRecord(record)} className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-full transition">
                            <ChevronRight size={18} />
                         </button>
                      </td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
      )}

      {/* 
        ========================================
        TAB: WAGE REGISTER (High Contrast & Beautified)
        ========================================
      */}
      {activeTab === 'register' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-end items-center">
                <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-700 text-sm font-bold transition">
                   <Download size={16} />
                   <span>{t('reg.export')}</span>
                </button>
            </div>
            <div className="overflow-x-auto">
             <table className="w-full text-sm text-left whitespace-nowrap border-collapse">
               {/* 
                  Beautified Header Structure:
                  - Group headers with distinct colors
                  - Clean separation lines
               */}
               <thead>
                  {/* Top Level Headers */}
                  <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                     <th rowSpan={2} className="px-4 py-3 border-r border-slate-600 text-center align-middle sticky left-0 z-10 bg-slate-800 w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">{t('payroll.col.emp')}</th>
                     <th rowSpan={2} className="px-2 py-3 border-r border-slate-600 text-center align-middle w-[80px]">{t('reg.workDays')}</th>
                     
                     <th colSpan={2} className="px-4 py-2 border-r border-slate-600 text-center bg-blue-900/50">{t('pay.col.A')}</th>
                     <th colSpan={4} className="px-4 py-2 border-r border-slate-600 text-center bg-green-900/50">{t('pay.col.B')}</th>
                     <th colSpan={3} className="px-4 py-2 border-r border-slate-600 text-center bg-red-900/50">{t('pay.col.C')}</th>
                     
                     <th rowSpan={2} className="px-4 py-3 text-center align-middle bg-slate-900 font-bold w-[120px]">{t('reg.net')}</th>
                  </tr>
                  {/* Sub Headers */}
                  <tr className="bg-slate-700 text-slate-200 text-xs">
                     {/* A */}
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-blue-800/30">{t('pay.item.base')}</th>
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-blue-800/30">{t('pay.item.job')}</th>
                     
                     {/* B */}
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-green-800/30">{t('pay.item.wdOt')}</th>
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-green-800/30">{t('reg.meal')}</th>
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-green-800/30">{t('reg.bonus')}</th>
                     <th className="px-3 py-2 text-right border-r border-slate-600 font-bold bg-green-900/50 text-white">{t('reg.gross')}</th>

                     {/* C */}
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-red-800/30">{t('reg.labor')}</th>
                     <th className="px-3 py-2 text-right border-r border-slate-600 bg-red-800/30">{t('reg.health')}</th>
                     <th className="px-3 py-2 text-right border-r border-slate-600 font-bold bg-red-900/50 text-white">{t('reg.totalDed')}</th>
                  </tr>
               </thead>
               <tbody className="text-slate-800 bg-white">
                  {currentData.map((record, idx) => {
                     const emp = employees.find(e => e.id === record.employeeId);
                     const isEven = idx % 2 === 0;
                     return (
                        <tr key={record.id} className={`${isEven ? 'bg-white' : 'bg-slate-50'} hover:bg-emerald-50 transition border-b border-slate-200`}>
                           {/* Sticky Employee Name Column */}
                           <td className={`px-4 py-3 border-r border-slate-200 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${isEven ? 'bg-white' : 'bg-slate-50'} group-hover:bg-emerald-50`}>
                              <div className="font-bold text-slate-800">{emp?.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{record.employeeId}</div>
                           </td>
                           
                           <td className="px-2 py-3 text-center border-r border-slate-200 text-slate-600">{record.workDays}</td>
                           
                           {/* A */}
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{record.baseSalary.toLocaleString()}</td>
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{record.jobAllowance.toLocaleString()}</td>
                           
                           {/* B */}
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{record.weekdayOvertimePay.toLocaleString()}</td>
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{record.mealAllowance.toLocaleString()}</td>
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{(record.otherBonuses + record.fullAttendanceBonus).toLocaleString()}</td>
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono font-bold text-green-700 bg-green-50/50">{record.grossSalary.toLocaleString()}</td>

                           {/* C */}
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{record.laborInsurance.toLocaleString()}</td>
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono text-slate-700">{record.healthInsurance.toLocaleString()}</td>
                           <td className="px-3 py-3 text-right border-r border-slate-200 font-mono font-bold text-red-700 bg-red-50/50">{record.totalDeductions.toLocaleString()}</td>

                           {/* Net */}
                           <td className="px-4 py-3 text-right border-r border-slate-200 font-mono font-bold text-emerald-800 bg-emerald-100/30 text-base">{record.netSalary.toLocaleString()}</td>
                        </tr>
                     );
                  })}
               </tbody>
             </table>
           </div>
         </div>
      )}

      {/* 
        ========================================
        TAB: HISTORY
        ========================================
      */}
      {activeTab === 'history' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <label className="block text-sm font-bold text-slate-700 mb-2">{t('payroll.hist.search')}</label>
               <div className="relative max-w-md">
                   <input 
                     type="text" 
                     value={historySearch}
                     onChange={(e) => setHistorySearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 placeholder:text-slate-400"
                     placeholder="e.g. E002 or Jane"
                   />
                   <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
               </div>
            </div>
            
            <div className="p-0">
               {historyData.length > 0 ? (
                  <table className="w-full text-sm text-left">
                     <thead className="bg-white text-slate-500 border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-4 font-normal">Month</th>
                           <th className="px-6 py-4 font-normal text-right">Gross Pay</th>
                           <th className="px-6 py-4 font-normal text-right">Deductions</th>
                           <th className="px-6 py-4 font-normal text-right">Net Pay</th>
                           <th className="px-6 py-4"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {historyData.map(record => (
                           <tr key={record.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedRecord(record)}>
                              <td className="px-6 py-4 font-bold text-slate-700">{record.month}</td>
                              <td className="px-6 py-4 text-right font-mono">{record.grossSalary.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right font-mono text-red-500">-{record.totalDeductions.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right font-mono font-bold text-emerald-700">{record.netSalary.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right"><ChevronRight size={16} className="text-slate-300" /></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                     <Search size={48} className="mb-4 opacity-20" />
                     <p>Search for an employee to view history.</p>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* 
        ========================================
        TAB: CALCULATION (Interactive)
        ========================================
      */}
      {activeTab === 'calc' && (
         <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4">
               <div className="flex items-center space-x-2 text-slate-700">
                  <Calculator size={24} className="text-emerald-600" />
                  <span className="text-lg font-bold">{t('payroll.calc.desc')}</span>
               </div>
               <button 
                  onClick={handleCalculate}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center space-x-2"
               >
                  <span>{t('payroll.calc.btn')}</span>
               </button>
               {currentData.length > 0 && <p className="text-xs text-green-600 font-medium">{t('payroll.calc.generated')}</p>}
            </div>

            {/* Editable List */}
            {currentData.length > 0 && (
               <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 text-sm text-emerald-800 font-medium">
                     Click on any employee to edit variable salary items.
                  </div>
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-4">{t('payroll.col.emp')}</th>
                           <th className="px-6 py-4 text-right text-slate-500">{t('pay.col.A')}</th>
                           <th className="px-6 py-4 text-right text-green-600 font-bold">{t('pay.col.B')} (Edit)</th>
                           <th className="px-6 py-4 text-right text-slate-500">{t('pay.col.C')}</th>
                           <th className="px-6 py-4 text-right font-bold">{t('payroll.col.net')}</th>
                           <th className="px-6 py-4"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {currentData.map(record => {
                           const emp = employees.find(e => e.id === record.employeeId);
                           return (
                              <tr key={record.id} className="hover:bg-emerald-50 cursor-pointer transition" onClick={() => setSelectedRecord(record)}>
                                 <td className="px-6 py-4 font-bold text-slate-800">{emp?.name}</td>
                                 <td className="px-6 py-4 text-right font-mono text-slate-500">{record.subtotalA.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right font-mono text-green-700 font-bold underline decoration-dotted">{record.subtotalB.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right font-mono text-slate-500">-{record.subtotalC.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right font-mono font-bold text-lg">{record.netSalary.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-right"><Edit size={16} className="text-emerald-500" /></td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      )}

      {/* 
        ========================================
        DETAIL MODAL (3-Column Layout)
        ========================================
      */}
      {selectedRecord && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
               {/* Modal Header */}
               <div className="bg-slate-800 text-white p-6 flex justify-between items-center shrink-0">
                  <div className="flex items-center space-x-4">
                     <FileText size={28} className="text-emerald-400" />
                     <div>
                        <h3 className="text-2xl font-bold">{t('payroll.detail.title')}</h3>
                        <p className="text-slate-400 text-sm flex items-center space-x-2">
                           <span>{selectedMonth}</span>
                           <span>•</span>
                           <span className="text-white font-bold">{employees.find(e => e.id === selectedRecord.employeeId)?.name}</span>
                        </p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedRecord(null)} className="hover:bg-slate-700 p-2 rounded-full transition">
                     <X size={24} />
                  </button>
               </div>
               
               {/* Modal Body - 3 Columns */}
               <div className="p-6 overflow-y-auto bg-slate-50 text-black">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     
                     {/* Column A: Fixed */}
                     <div className="bg-white p-5 rounded-xl border-2 border-slate-300 shadow-sm flex flex-col">
                        <h4 className="font-bold text-black border-b-2 border-black pb-3 mb-4">{t('pay.col.A')}</h4>
                        <div className="space-y-4 flex-1">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.base')}</span>
                              <span className="font-mono font-bold text-black">{selectedRecord.baseSalary.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.meal')}</span>
                              <span className="font-mono text-black">{selectedRecord.mealAllowance.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.fullAtt')}</span>
                              <span className="font-mono text-black">{selectedRecord.fullAttendanceBonus.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.job')}</span>
                              <span className="font-mono text-black">{selectedRecord.jobAllowance.toLocaleString()}</span>
                           </div>
                        </div>
                        <div className="mt-6 pt-4 border-t-2 border-slate-300 flex justify-between items-center font-bold text-lg bg-slate-100 p-3 rounded text-black">
                           <span>{t('pay.subtotal')} A</span>
                           <span>{selectedRecord.subtotalA.toLocaleString()}</span>
                        </div>
                     </div>

                     {/* Column B: Variable (Editable if in Calc Mode) */}
                     <div className="bg-white p-5 rounded-xl border-2 border-emerald-300 shadow-sm flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                        <h4 className="font-bold text-black border-b-2 border-emerald-500 pb-3 mb-4">{t('pay.col.B')}</h4>
                        <div className="space-y-4 flex-1">
                           <EditableItem 
                             label={t('pay.item.wdOt')} 
                             value={selectedRecord.weekdayOvertimePay} 
                             onChange={val => handleEditRecord(selectedRecord, 'weekdayOvertimePay', val)}
                             editable={activeTab === 'calc'}
                           />
                           <EditableItem 
                             label={t('pay.item.rdOt')} 
                             value={selectedRecord.restDayOvertimePay} 
                             onChange={val => handleEditRecord(selectedRecord, 'restDayOvertimePay', val)}
                             editable={activeTab === 'calc'}
                           />
                           <EditableItem 
                             label={t('pay.item.holOt')} 
                             value={selectedRecord.holidayOvertimePay} 
                             onChange={val => handleEditRecord(selectedRecord, 'holidayOvertimePay', val)}
                             editable={activeTab === 'calc'}
                           />
                           <EditableItem 
                             label={t('pay.item.annual')} 
                             value={selectedRecord.unusedAnnualLeavePay} 
                             onChange={val => handleEditRecord(selectedRecord, 'unusedAnnualLeavePay', val)}
                             editable={activeTab === 'calc'}
                           />
                           <EditableItem 
                             label={t('reg.bonus')} 
                             value={selectedRecord.otherBonuses} 
                             onChange={val => handleEditRecord(selectedRecord, 'otherBonuses', val)}
                             editable={activeTab === 'calc'}
                           />
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('reg.transport')}</span>
                              <span className="font-mono text-black">{selectedRecord.transportAllowance.toLocaleString()}</span>
                           </div>
                        </div>
                        <div className="mt-6 pt-4 border-t-2 border-emerald-200 flex justify-between items-center font-bold text-lg bg-emerald-50 text-black p-3 rounded">
                           <span>{t('pay.subtotal')} B</span>
                           <span>+{selectedRecord.subtotalB.toLocaleString()}</span>
                        </div>
                     </div>

                     {/* Column C: Deductions */}
                     <div className="bg-white p-5 rounded-xl border-2 border-red-300 shadow-sm flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <h4 className="font-bold text-black border-b-2 border-red-500 pb-3 mb-4">{t('pay.col.C')}</h4>
                        <div className="space-y-4 flex-1">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.labor')}</span>
                              <span className="font-mono text-red-700 font-bold">-{selectedRecord.laborInsurance.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.health')}</span>
                              <span className="font-mono text-red-700 font-bold">-{selectedRecord.healthInsurance.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.pension')}</span>
                              <span className="font-mono text-red-700 font-bold">-{selectedRecord.pension.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.welfare')}</span>
                              <span className="font-mono text-red-700 font-bold">-{selectedRecord.welfareFund.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-black font-medium">{t('pay.item.tax')}</span>
                              <span className="font-mono text-red-700 font-bold">-{selectedRecord.tax.toLocaleString()}</span>
                           </div>
                           <EditableItem 
                             label={t('pay.item.sickDed')} 
                             value={selectedRecord.sickLeaveDeduction} 
                             onChange={val => handleEditRecord(selectedRecord, 'sickLeaveDeduction', val)}
                             editable={activeTab === 'calc'}
                             isDeduction
                           />
                           <EditableItem 
                             label={t('pay.item.persDed')} 
                             value={selectedRecord.personalLeaveDeduction} 
                             onChange={val => handleEditRecord(selectedRecord, 'personalLeaveDeduction', val)}
                             editable={activeTab === 'calc'}
                             isDeduction
                           />
                        </div>
                        <div className="mt-6 pt-4 border-t-2 border-red-200 flex justify-between items-center font-bold text-lg bg-red-50 text-black p-3 rounded">
                           <span>{t('pay.subtotal')} C</span>
                           <span>-{selectedRecord.subtotalC.toLocaleString()}</span>
                        </div>
                     </div>

                  </div>
                  
                  {/* Final Calculation Banner */}
                  <div className="mt-6 bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg">
                     <div className="mb-4 md:mb-0">
                        <h5 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-1">Total Net Payable</h5>
                        <p className="text-sm opacity-80">(A) Fixed + (B) Variable - (C) Deductions</p>
                     </div>
                     <div className="text-5xl font-mono font-bold text-emerald-400">
                        ${selectedRecord.netSalary.toLocaleString()}
                     </div>
                  </div>

               </div>
               
               {/* Modal Footer */}
               <div className="p-5 border-t border-slate-200 bg-white flex justify-end shrink-0">
                  <button 
                     type="button" 
                     onClick={() => setSelectedRecord(null)}
                     className="mr-3 px-6 py-2 rounded-lg text-slate-600 font-bold hover:bg-slate-100 transition"
                  >
                     Close
                  </button>
                  <button 
                     className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center space-x-2"
                  >
                     <Download size={18} />
                     <span>PDF</span>
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

// Helper for Editable Items
const EditableItem: React.FC<{ 
   label: string, 
   value: number, 
   onChange: (val: number) => void, 
   editable: boolean,
   isDeduction?: boolean
}> = ({ label, value, onChange, editable, isDeduction }) => {
   if (editable) {
      return (
         <div className="flex justify-between items-center text-sm">
            <span className="text-black font-medium">{label}</span>
            <input 
              type="number" 
              value={value} 
              onChange={e => onChange(parseInt(e.target.value) || 0)}
              className="w-24 text-right border-b border-dashed border-slate-400 focus:border-emerald-500 bg-transparent outline-none font-mono font-bold text-black"
            />
         </div>
      );
   }
   return (
      <div className="flex justify-between items-center text-sm">
         <span className="text-black font-medium">{label}</span>
         <span className={`font-mono font-bold ${isDeduction ? 'text-red-700' : 'text-black'}`}>
            {isDeduction && '-'}{value.toLocaleString()}
         </span>
      </div>
   );
};

export default Payroll;
