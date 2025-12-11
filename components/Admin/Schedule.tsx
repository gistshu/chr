
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { ChevronLeft, ChevronRight, Printer, AlertCircle, CheckCircle, Save, X } from 'lucide-react';
import { Shift, AttendanceRecord, AttendanceStatus } from '../../types';
import { SHIFT_TYPES } from '../../constants';

const Schedule: React.FC = () => {
  const { employees, shifts, attendance, updateAttendance, updateShift, addAttendance, t } = useApp();
  const [currentStartWeek, setCurrentStartWeek] = useState(new Date());
  
  // Modal State
  const [selectedCell, setSelectedCell] = useState<{ empId: string, date: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Helper to get dates for the week view
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Start on Monday
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentStartWeek);

  const getShiftForEmployee = (empId: string, date: string) => {
    return shifts.find(s => s.employeeId === empId && s.date === date);
  };

  const getAttendanceForEmployee = (empId: string, date: string) => {
    return attendance.find(a => a.employeeId === empId && a.date === date);
  };

  const changeWeek = (offset: number) => {
    const newDate = new Date(currentStartWeek);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setCurrentStartWeek(newDate);
  };

  const handleCellClick = (empId: string, date: string) => {
    setSelectedCell({ empId, date });
    setModalOpen(true);
  };

  const getDuration = (start?: string, end?: string) => {
     if (!start || !end || start === '-' || end === '-') return 0;
     const s = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
     const e = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
     return Math.max(0, (e - s) / 60);
  };

  // Helper to safely get color/config even if type is unknown
  const getShiftConfig = (type: string) => {
      return SHIFT_TYPES[type as keyof typeof SHIFT_TYPES] || SHIFT_TYPES['Full'];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-slate-800">{t('sched.title')}</h2>
          <p className="text-sm text-slate-500">{t('sched.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-white rounded-md shadow-sm transition"><ChevronLeft size={16} /></button>
            <span className="px-4 text-sm font-medium text-slate-700">
              {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </span>
            <button onClick={() => changeWeek(1)} className="p-2 hover:bg-white rounded-md shadow-sm transition"><ChevronRight size={16} /></button>
          </div>
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 w-48 sticky left-0 bg-slate-50 z-10">{t('payroll.col.emp')}</th>
                {weekDates.map(date => (
                  <th key={date.toISOString()} className="px-2 py-4 min-w-[140px] text-center">
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xs text-slate-400">{date.getDate()}</div>
                  </th>
                ))}
                <th className="px-4 py-4 text-center w-24">{t('sched.col.total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                let weeklyHours = 0;
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 sticky left-0 bg-white z-10 border-r border-slate-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center space-x-3">
                        <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-medium text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.department}</p>
                        </div>
                      </div>
                    </td>
                    {weekDates.map(date => {
                      const dateStr = date.toISOString().split('T')[0];
                      const shift = getShiftForEmployee(emp.id, dateStr);
                      const attendance = getAttendanceForEmployee(emp.id, dateStr);
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      
                      // Determine effective hours (Actual vs Sched)
                      const shiftConfig = shift ? getShiftConfig(shift.type) : null;
                      const schedDuration = getDuration(shift?.startTime, shift?.endTime);
                      
                      // Use finalized time if available, otherwise check-in time
                      const actualIn = attendance?.finalizedIn || attendance?.checkIn;
                      const actualOut = attendance?.finalizedOut || attendance?.checkOut;
                      const actualDuration = getDuration(actualIn, actualOut);
                      
                      const isWorkingShift = shift?.startTime !== '-';
                      const isOvertime = actualDuration > schedDuration && isWorkingShift;
                      const isVerified = attendance?.isVerified;

                      if (shift && isWorkingShift) weeklyHours += (isVerified ? actualDuration : schedDuration);

                      return (
                        <td 
                          key={dateStr} 
                          onClick={() => handleCellClick(emp.id, dateStr)}
                          className={`px-2 py-3 border-r border-slate-50 cursor-pointer hover:bg-emerald-50 transition ${isWeekend ? 'bg-slate-50/50' : ''}`}
                        >
                          {shift ? (
                            <div className={`p-2 rounded-lg text-xs text-center border relative ${shiftConfig?.color}`}>
                              {/* Verification Badge */}
                              {isVerified && (
                                <div className="absolute top-1 right-1 text-emerald-600">
                                   <CheckCircle size={10} fill="currentColor" className="text-white" />
                                </div>
                              )}

                              <div className="font-bold mb-1 truncate">{t(`sched.type.${shift.type}`) || shift.type}</div>
                              {shift.startTime !== '-' && <div className="text-[10px] opacity-80">{shift.startTime} - {shift.endTime}</div>}
                              
                              {/* Actual Time Display */}
                              {(actualIn && actualOut) && (
                                <div className={`mt-1 pt-1 border-t text-[10px] font-mono ${isOvertime ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                                   {actualIn}-{actualOut}
                                </div>
                              )}
                            </div>
                          ) : (
                             <div className="h-14 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 text-xs">
                               -
                             </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center font-bold text-slate-700">
                      {Math.round(weeklyHours)}h
                      {weeklyHours > 46 && <span className="block text-[10px] text-red-500">Over limit</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800 flex items-start space-x-2">
         <AlertCircle size={18} className="shrink-0 mt-0.5" />
         <div>
            <div className="font-bold">{t('sched.note.title')}</div>
            <p>{t('sched.note.desc')}</p>
         </div>
      </div>

      {/* Edit Shift Modal */}
      {modalOpen && selectedCell && (
        <ShiftDetailModal 
           empId={selectedCell.empId} 
           date={selectedCell.date} 
           onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
};

// Sub-component for the Modal
const ShiftDetailModal: React.FC<{ empId: string, date: string, onClose: () => void }> = ({ empId, date, onClose }) => {
   const { shifts, attendance, updateAttendance, addAttendance, updateShift, t, employees } = useApp();
   const employee = employees.find(e => e.id === empId);
   
   const shift = shifts.find(s => s.employeeId === empId && s.date === date);
   const attRecord = attendance.find(a => a.employeeId === empId && a.date === date);
   
   // State
   const [shiftType, setShiftType] = useState<string>(shift?.type || 'RestDay');
   const [verifiedIn, setVerifiedIn] = useState(attRecord?.finalizedIn || attRecord?.checkIn || '');
   const [verifiedOut, setVerifiedOut] = useState(attRecord?.finalizedOut || attRecord?.checkOut || '');

   // Calculate durations for alert
   const getDuration = (s?: string, e?: string) => {
      if (!s || !e || s === '-' || e === '-') return 0;
      return (parseInt(e.split(':')[0]) * 60 + parseInt(e.split(':')[1])) - (parseInt(s.split(':')[0]) * 60 + parseInt(s.split(':')[1]));
   };
   
   // Get schedule times based on selected type
   const schedConfig = SHIFT_TYPES[shiftType as keyof typeof SHIFT_TYPES];
   const schedDuration = getDuration(schedConfig?.start, schedConfig?.end);
   const actualDuration = getDuration(verifiedIn, verifiedOut);
   const isOvertime = actualDuration > schedDuration && schedConfig?.start !== '-';

   const handleSave = () => {
      // 1. Update Shift
      if (shift) {
         updateShift(shift.id, { 
             type: shiftType as any, 
             startTime: schedConfig.start, 
             endTime: schedConfig.end 
         });
      }

      // 2. Update Attendance (Actuals & Verification)
      if (attRecord) {
         updateAttendance(attRecord.id, {
            finalizedIn: verifiedIn,
            finalizedOut: verifiedOut,
            isVerified: true
         });
      } else if (verifiedIn || verifiedOut) {
         // Create record if manual entry without clock-in
         addAttendance({
            id: `A-MANUAL-${Date.now()}`,
            employeeId: empId,
            date: date,
            checkIn: verifiedIn, // Use manual as check-in
            checkOut: verifiedOut,
            finalizedIn: verifiedIn,
            finalizedOut: verifiedOut,
            status: AttendanceStatus.ON_TIME,
            locationType: 'WIFI',
            isVerified: true,
            note: 'Manual Admin Entry'
         });
      }

      onClose();
   };

   return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
         <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-900 text-white p-4 flex justify-between items-center">
               <h3 className="font-bold text-lg">{t('sched.modal.title')}</h3>
               <button onClick={onClose}><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-6">
               <div className="flex items-center space-x-3 mb-2">
                  <img src={employee?.avatar} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                     <div className="font-bold text-slate-800">{employee?.name}</div>
                     <div className="text-xs text-slate-500">{date}</div>
                  </div>
               </div>

               {/* Shift Planning */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">{t('sched.modal.shiftType')}</label>
                  <select 
                     value={shiftType}
                     onChange={(e) => setShiftType(e.target.value)}
                     className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                  >
                     {Object.keys(SHIFT_TYPES).map(type => (
                        <option key={type} value={type}>{t(`sched.type.${type}`) || type}</option>
                     ))}
                  </select>
                  <div className="text-xs text-slate-500 flex justify-between">
                     <span>{t('sched.modal.schedTime')}:</span>
                     <span className="font-mono font-medium text-slate-700">
                        {schedConfig?.start === '-' ? 'OFF' : `${schedConfig?.start} - ${schedConfig?.end}`}
                     </span>
                  </div>
               </div>

               <hr />

               {/* Reference Log */}
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">{t('sched.modal.logTime')}</div>
                  <div className="flex justify-between items-center text-sm font-mono text-slate-600">
                     <span>{attRecord?.checkIn || '--:--'}</span>
                     <span>→</span>
                     <span>{attRecord?.checkOut || '--:--'}</span>
                  </div>
                  {attRecord?.note && <div className="text-xs text-slate-400 mt-1 italic">Note: {attRecord.note}</div>}
               </div>

               {/* Actual Input */}
               <div className="space-y-3">
                  <label className="text-xs font-bold text-emerald-800 uppercase flex items-center space-x-2">
                     <CheckCircle size={14} />
                     <span>{t('sched.modal.actualTime')}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] text-slate-500">{t('sched.modal.in')}</label>
                        <input 
                           type="time" 
                           value={verifiedIn}
                           onChange={(e) => setVerifiedIn(e.target.value)}
                           className="w-full border border-slate-300 rounded p-2 text-sm font-mono text-slate-900"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] text-slate-500">{t('sched.modal.out')}</label>
                        <input 
                           type="time" 
                           value={verifiedOut}
                           onChange={(e) => setVerifiedOut(e.target.value)}
                           className="w-full border border-slate-300 rounded p-2 text-sm font-mono text-slate-900"
                        />
                     </div>
                  </div>
                  
                  {isOvertime && (
                     <div className="bg-red-50 text-red-700 text-xs p-2 rounded border border-red-100 flex items-start space-x-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{t('sched.modal.alert')} (+{Math.round((actualDuration - schedDuration)/60 * 10) / 10}h)</span>
                     </div>
                  )}
               </div>

               <button 
                  onClick={handleSave}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
               >
                  <CheckCircle size={18} />
                  <span>{t('sched.modal.verify')}</span>
               </button>

            </div>
         </div>
      </div>
   );
};

export default Schedule;
