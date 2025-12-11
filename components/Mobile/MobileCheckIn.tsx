
import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { MapPin, Wifi, CheckCircle, Clock } from 'lucide-react';
import { AttendanceStatus } from '../../types';

const MobileCheckIn: React.FC = () => {
  const { currentUser, addAttendance, updateAttendance, attendance, t, language } = useApp();
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState<'IN' | 'OUT' | null>(null);
  const [msg, setMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(r => r.employeeId === currentUser.id && r.date === todayStr);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = (type: 'IN' | 'OUT') => {
    setLoading(type);
    setMsg(null);

    // Simulate Network/Location delay
    setTimeout(() => {
        const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        
        if (type === 'IN') {
             if (todayRecord) {
                 // Update existing check-in (Overwrite logic)
                 updateAttendance(todayRecord.id, { checkIn: timeStr });
                 setMsg({ type: 'success', text: `${t('checkin.updated')} ${timeStr}` });
             } else {
                 addAttendance({
                     id: `A-${Date.now()}`,
                     employeeId: currentUser.id,
                     date: todayStr,
                     checkIn: timeStr,
                     locationType: Math.random() > 0.5 ? 'WIFI' : 'GPS',
                     status: AttendanceStatus.ON_TIME
                 });
                 setMsg({ type: 'success', text: `${t('checkin.success.in')} ${timeStr}` });
             }
        } else {
             // Check out
             if (todayRecord) {
                 updateAttendance(todayRecord.id, { checkOut: timeStr });
                 setMsg({ type: 'success', text: `${t('checkin.success.out')} ${timeStr}` });
             } else {
                 addAttendance({
                    id: `A-${Date.now()}`,
                    employeeId: currentUser.id,
                    date: todayStr,
                    checkOut: timeStr,
                    locationType: 'GPS',
                    status: AttendanceStatus.LATE 
                });
                setMsg({ type: 'success', text: `${t('checkin.success.out')} ${timeStr}` });
             }
        }
        setLoading(null);
    }, 1000);
  };

  // Locale aware date string
  const dateString = time.toLocaleDateString(language === 'zh' ? 'zh-TW' : language === 'ja' ? 'ja-JP' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col items-center h-full pt-4 space-y-6">
      
      {/* Time Display */}
      <div className="text-center space-y-1">
        <p className="text-emerald-700/60 text-xs font-medium uppercase tracking-widest">{dateString}</p>
        <h2 className="text-5xl font-mono font-bold text-slate-800">
          {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <div className="flex justify-center items-center space-x-2 pt-2">
           <span className="flex items-center space-x-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              <Wifi size={10} /> <span>{t('checkin.officeWifi')}</span>
           </span>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-4 w-full px-2">
         <button 
           onClick={() => handleAction('IN')}
           disabled={!!loading}
           className="aspect-square bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 flex flex-col items-center justify-center text-white active:scale-95 transition-transform disabled:opacity-70"
         >
            {loading === 'IN' ? (
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mb-2"></div>
            ) : (
                <Clock size={40} className="mb-3" />
            )}
            <span className="text-lg font-bold">{t('checkin.clockIn')}</span>
            <span className="text-xs opacity-70">{t('checkin.clockIn.sub')}</span>
         </button>

         <button 
           onClick={() => handleAction('OUT')}
           disabled={!!loading}
           className="aspect-square bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 flex flex-col items-center justify-center text-white active:scale-95 transition-transform disabled:opacity-70"
         >
             {loading === 'OUT' ? (
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mb-2"></div>
            ) : (
                <CheckCircle size={40} className="mb-3" />
            )}
            <span className="text-lg font-bold">{t('checkin.clockOut')}</span>
            <span className="text-xs opacity-70">{t('checkin.clockOut.sub')}</span>
         </button>
      </div>

      {/* Message Area */}
      {msg && (
        <div className={`w-full p-3 rounded-lg text-sm text-center font-medium animate-fade-in ${
            msg.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
            {msg.text}
        </div>
      )}

      {/* Today's Log Card */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 mt-auto">
         <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">{t('checkin.todayRecord')}</h3>
         <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-slate-600">{t('checkin.startTime')}</span>
               </div>
               <span className="font-mono font-medium text-slate-800">
                 {todayRecord?.checkIn || '--:--'}
               </span>
            </div>
            <div className="flex justify-between items-center">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-slate-600">{t('checkin.endTime')}</span>
               </div>
               <span className="font-mono font-medium text-slate-800">
                 {todayRecord?.checkOut || '--:--'}
               </span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default MobileCheckIn;
