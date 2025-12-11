
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Save, Users, User, Calendar } from 'lucide-react';
import { Shift, AttendanceStatus } from '../../types';

const MobileSchedule: React.FC = () => {
  const { currentUser, employees, shifts, attendance, updateAttendance, addAttendance, t, language } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ start: '', end: '' });
  const [viewMode, setViewMode] = useState<'mine' | 'team'>('mine'); // New state for toggling views

  // Get dates for the current week view (Sunday to Saturday)
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start on Sunday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);

  const handleWeekChange = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Helper for Mine View
  const getMyShift = (dateStr: string) => {
    return shifts.find(s => s.employeeId === currentUser.id && s.date === dateStr);
  };

  const getMyAttendance = (dateStr: string) => {
    return attendance.find(a => a.employeeId === currentUser.id && a.date === dateStr);
  };

  // Helper for Team View
  const getTeamShiftsForDay = (dateStr: string) => {
      // Filter out RestDay or OFF if needed, or show all
      return shifts.filter(s => s.date === dateStr && s.type !== 'RestDay' && s.type !== 'RegularLeave').map(s => {
          const emp = employees.find(e => e.id === s.employeeId);
          return { ...s, empName: emp?.name, empAvatar: emp?.avatar };
      });
  };

  const startEditing = (dateStr: string, currentAtt: any) => {
    setEditingId(dateStr);
    setEditForm({
      start: currentAtt?.checkIn || '',
      end: currentAtt?.checkOut || ''
    });
  };

  const saveActuals = (dateStr: string) => {
    const existing = getMyAttendance(dateStr);
    if (existing) {
      updateAttendance(existing.id, {
        checkIn: editForm.start,
        checkOut: editForm.end,
        note: existing.note ? existing.note : 'Self-reported time'
      });
    } else {
      addAttendance({
        id: `A-MANUAL-${Date.now()}`,
        employeeId: currentUser.id,
        date: dateStr,
        checkIn: editForm.start,
        checkOut: editForm.end,
        status: AttendanceStatus.ON_TIME,
        locationType: 'WIFI',
        note: 'Manual Entry'
      });
    }
    setEditingId(null);
  };

  // Helper to check for OT (mock logic)
  const isOvertime = (s: string, e: string) => {
    if (!s || !e) return false;
    const start = parseInt(s.split(':')[0]);
    const end = parseInt(e.split(':')[0]);
    return (end - start) > 9; // Roughly > 9 hours
  };

  const locale = language === 'zh' ? 'zh-TW' : language === 'ja' ? 'ja-JP' : 'en-US';

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-emerald-50">
        <button onClick={() => handleWeekChange(-1)} className="p-2 text-slate-400 hover:text-emerald-600">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="font-bold text-slate-800">
            {weekDates[0].toLocaleDateString(locale, { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs text-slate-500">2023</div>
        </div>
        <button onClick={() => handleWeekChange(1)} className="p-2 text-slate-400 hover:text-emerald-600">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button 
          onClick={() => setViewMode('mine')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-bold transition-all ${
             viewMode === 'mine' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
           <User size={16} />
           <span>{t('sched.tab.mine')}</span>
        </button>
        <button 
          onClick={() => setViewMode('team')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-sm font-bold transition-all ${
             viewMode === 'team' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
           <Users size={16} />
           <span>{t('sched.tab.team')}</span>
        </button>
      </div>

      {/* 
         VIEW: MINE 
      */}
      {viewMode === 'mine' && (
         <div className="flex-1 overflow-y-auto space-y-3 pb-20">
         {weekDates.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const shift = getMyShift(dateStr);
            const att = getMyAttendance(dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const isEditing = editingId === dateStr;
            
            if (!shift && !att) return null;

            return (
               <div key={dateStr} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${isToday ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200'}`}>
               <div className="flex justify-between items-start mb-3">
                  <div>
                     <div className="font-bold text-slate-800 flex items-center">
                     {date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}
                     {isToday && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{t('sched.today')}</span>}
                     </div>
                     <div className="text-xs text-slate-500 mt-1">
                     {t('sched.scheduled')}: <span className="font-medium text-slate-700">{shift ? `${shift.startTime} - ${shift.endTime}` : 'OFF'}</span>
                     </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${shift?.type === 'Off' ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'}`}>
                     {shift?.type || 'Off'}
                  </div>
               </div>

               {/* Clock Data (Read Only) */}
               <div className="bg-blue-50/50 rounded-lg p-3 mb-2 border border-blue-100">
                  <div className="flex items-center space-x-1 text-xs text-blue-600 font-bold uppercase mb-1">
                     <Clock size={12} />
                     <span>{t('sched.clocked')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono text-slate-700">
                     <span>{att?.checkIn || '--:--'}</span>
                     <span className="text-slate-300 mx-2">→</span>
                     <span>{att?.checkOut || '--:--'}</span>
                  </div>
               </div>

               {/* Actual Input Section */}
               <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                     <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium uppercase">
                     <Calendar size={12} />
                     <span>{t('sched.actual')}</span>
                     </div>
                     {!isEditing && (
                     <button 
                        onClick={() => startEditing(dateStr, att)}
                        className="text-xs text-emerald-600 underline hover:text-emerald-800 font-bold"
                     >
                        {t('sched.edit')}
                     </button>
                     )}
                  </div>

                  {isEditing ? (
                     <div className="space-y-3">
                     <div className="flex space-x-2">
                        <div className="flex-1">
                           <label className="text-[10px] text-slate-400">In</label>
                           <input 
                           type="time" 
                           value={editForm.start}
                           onChange={e => setEditForm({...editForm, start: e.target.value})}
                           className="w-full text-sm border border-slate-300 rounded px-2 py-1 text-slate-900"
                           />
                        </div>
                        <div className="flex-1">
                           <label className="text-[10px] text-slate-400">Out</label>
                           <input 
                           type="time" 
                           value={editForm.end}
                           onChange={e => setEditForm({...editForm, end: e.target.value})}
                           className="w-full text-sm border border-slate-300 rounded px-2 py-1 text-slate-900"
                           />
                        </div>
                     </div>
                     {isOvertime(editForm.start, editForm.end) && (
                        <div className="flex items-start space-x-2 bg-yellow-50 p-2 rounded text-xs text-yellow-800 border border-yellow-200">
                           <AlertCircle size={14} className="shrink-0 mt-0.5" />
                           <p>{t('sched.otDetected')}</p>
                        </div>
                     )}
                        {isOvertime(editForm.start, editForm.end) && (
                        <div className="flex space-x-2">
                           <button className="flex-1 py-1 text-xs bg-white border border-yellow-300 text-yellow-700 rounded shadow-sm">{t('sched.payOt')}</button>
                           <button className="flex-1 py-1 text-xs bg-white border border-yellow-300 text-yellow-700 rounded shadow-sm">{t('sched.compLeave')}</button>
                        </div>
                     )}
                     <button 
                        onClick={() => saveActuals(dateStr)}
                        className="w-full bg-emerald-600 text-white text-sm py-1.5 rounded flex items-center justify-center space-x-1 hover:bg-emerald-700"
                     >
                        <Save size={14} />
                        <span>{t('sched.save')}</span>
                     </button>
                     </div>
                  ) : (
                     <div className="flex justify-between items-center text-sm">
                     <div className="font-mono text-slate-700">
                        {(att?.finalizedIn || att?.checkIn) || '--:--'} <span className="text-slate-300 mx-1">→</span> {(att?.finalizedOut || att?.checkOut) || '--:--'}
                     </div>
                     {att?.note && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{t('sched.edited')}</span>}
                     </div>
                  )}
               </div>
               </div>
            );
         })}
         </div>
      )}

      {/* 
         VIEW: TEAM 
      */}
      {viewMode === 'team' && (
         <div className="flex-1 overflow-y-auto space-y-4 pb-20">
            {weekDates.map(date => {
               const dateStr = date.toISOString().split('T')[0];
               const teamShifts = getTeamShiftsForDay(dateStr);
               const isToday = new Date().toISOString().split('T')[0] === dateStr;

               return (
                  <div key={dateStr} className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${isToday ? 'ring-1 ring-emerald-500' : ''}`}>
                     <div className={`p-3 font-bold text-sm flex justify-between items-center ${isToday ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700'}`}>
                        <span>{date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        {isToday && <span className="text-[10px] px-2 py-0.5 bg-white rounded-full border border-emerald-200 text-emerald-600">Today</span>}
                     </div>
                     <div className="divide-y divide-slate-50">
                        {teamShifts.length > 0 ? teamShifts.map((shift, idx) => (
                           <div key={idx} className="p-3 flex justify-between items-center hover:bg-slate-50">
                              <div className="flex items-center space-x-3">
                                 <img src={shift.empAvatar} className="w-8 h-8 rounded-full border border-slate-100" alt="" />
                                 <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-800">{shift.empName}</span>
                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded w-fit">{shift.type}</span>
                                 </div>
                              </div>
                              <div className="font-mono text-xs text-slate-600 font-bold">
                                 {shift.startTime} - {shift.endTime}
                              </div>
                           </div>
                        )) : (
                           <div className="p-4 text-center text-xs text-slate-400 italic">No shifts scheduled.</div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      )}

    </div>
  );
};

export default MobileSchedule;
