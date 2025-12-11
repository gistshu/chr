
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { MapPin, Wifi, Edit2, Download, Settings, Save, X, Clock } from 'lucide-react';
import { AttendanceStatus } from '../../types';

const AttendanceList: React.FC = () => {
  const { attendance, employees, shifts, updateAttendance, t } = useApp();
  const [filterDate, setFilterDate] = useState('2023-10-23'); // Default to mock date
  const [showSettings, setShowSettings] = useState(false);
  const [wifiSsid, setWifiSsid] = useState('Clinic_Staff_5G');
  const [externalIp, setExternalIp] = useState('203.0.113.55');

  const filteredAttendance = attendance.filter(r => r.date === filterDate);

  const getShift = (empId: string, date: string) => {
    return shifts.find(s => s.employeeId === empId && s.date === date);
  };

  const handleNoteChange = (id: string, newNote: string) => {
    updateAttendance(id, { note: newNote });
  };

  const handleTimeChange = (id: string, field: 'checkIn' | 'checkOut', value: string) => {
     const currentRecord = attendance.find(a => a.id === id);
     if (!currentRecord) return;

     const adminNote = t('att.note.adminEdit');
     let newNote = currentRecord.note || '';

     // Append "(Admin Entry)" only if not already present
     if (!newNote.includes(adminNote)) {
        newNote = newNote ? `${newNote} ${adminNote}` : adminNote;
     }

     updateAttendance(id, {
        [field]: value,
        note: newNote,
        // If absent or unlogged, defaulting location type so it doesn't look broken
        locationType: currentRecord.locationType || 'WIFI', 
     });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('att.title')}</h2>
        
        <div className="flex flex-wrap gap-3 items-center">
          {/* Settings Button (PDF Req 1) */}
          <button 
             onClick={() => setShowSettings(true)}
             className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            <Settings size={16} />
            <span>{t('att.settings')}</span>
          </button>

          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
          />
          
          <button className="flex items-center space-x-2 border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-100 transition">
            <Download size={16} />
            <span>{t('att.export')}</span>
          </button>
        </div>
      </div>

      {/* Configuration Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-emerald-800 text-white p-4 flex justify-between items-center">
                 <h3 className="font-bold">{t('att.settings.title')}</h3>
                 <button onClick={() => setShowSettings(false)} className="hover:text-red-300"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('att.wifiSsid')}</label>
                    <input 
                      type="text" 
                      value={wifiSsid} 
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t('att.ip')}</label>
                    <input 
                      type="text" 
                      value={externalIp} 
                      onChange={(e) => setExternalIp(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900" 
                    />
                 </div>
                 <div className="pt-2">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center justify-center space-x-2"
                    >
                       <Save size={18} />
                       <span>{t('att.save')}</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Detailed Table (PDF Req 3, 7) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-4 py-4">{t('att.col.date')}</th>
                <th className="px-4 py-4">{t('att.col.empId')}</th>
                <th className="px-4 py-4">{t('att.col.name')}</th>
                <th className="px-4 py-4 w-64">{t('att.col.location')}</th>
                <th className="px-4 py-4">{t('att.col.shift')}</th>
                <th className="px-4 py-4">{t('att.col.actual')}</th>
                <th className="px-4 py-4 min-w-[200px]">{t('att.col.note')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.length > 0 ? filteredAttendance.map(record => {
                const emp = employees.find(e => e.id === record.employeeId);
                const shift = getShift(record.employeeId, record.date);
                const isLate = record.status === AttendanceStatus.LATE;
                const isEarly = record.status === AttendanceStatus.EARLY_LEAVE;

                return (
                  <tr key={record.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                       {record.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-500 font-mono">
                       {record.employeeId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-700">
                       <div className="flex items-center space-x-2">
                          <img src={emp?.avatar} alt="" className="w-6 h-6 rounded-full" />
                          <span>{emp?.name}</span>
                       </div>
                    </td>
                    
                    {/* Location Info (PDF Req 3: WIFI/GPS/Distance) */}
                    <td className="px-4 py-4">
                       <div className="flex flex-col space-y-1">
                          {record.locationType === 'WIFI' ? (
                             <div className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                                <Wifi size={12} />
                                <span className="text-xs font-medium">{record.wifiSsid || 'WIFI'}</span>
                             </div>
                          ) : (
                             <div className="flex items-center space-x-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded w-fit">
                                <MapPin size={12} />
                                <span className="text-xs font-medium">GPS</span>
                             </div>
                          )}
                          {record.locationType === 'GPS' && record.gpsLocation && (
                             <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{record.gpsLocation}</div>
                          )}
                          <div className="text-[10px] text-slate-500">
                             {t('att.label.dist')}: <span className={`font-mono ${record.distance && record.distance > 100 ? 'text-red-500 font-bold' : ''}`}>{record.distance}m</span>
                          </div>
                       </div>
                    </td>

                    {/* Shift vs Actual (PDF Req 7: Compare & Highlight) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                       <div className="text-xs text-slate-500 mb-1">{shift?.type || 'Off'}</div>
                       <div className="font-mono text-slate-700">{shift?.startTime || '--:--'} - {shift?.endTime || '--:--'}</div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                       <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1">
                             <span className={`text-xs w-8 ${isLate ? 'text-red-600 font-bold' : 'text-slate-400'}`}>In:</span>
                             <input 
                               type="time"
                               value={record.checkIn || ''}
                               onChange={(e) => handleTimeChange(record.id, 'checkIn', e.target.value)}
                               className={`bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-500 outline-none text-sm font-mono w-24 ${isLate ? 'text-red-600' : 'text-slate-700'}`}
                             />
                             {isLate && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">LATE</span>}
                          </div>
                          <div className="flex items-center space-x-1">
                             <span className={`text-xs w-8 ${isEarly ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>Out:</span>
                             <input 
                               type="time"
                               value={record.checkOut || ''}
                               onChange={(e) => handleTimeChange(record.id, 'checkOut', e.target.value)}
                               className={`bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-500 outline-none text-sm font-mono w-24 ${isEarly ? 'text-orange-600' : 'text-slate-700'}`}
                             />
                             {isEarly && <span className="text-[10px] bg-orange-100 text-orange-600 px-1 rounded">EARLY</span>}
                          </div>
                       </div>
                    </td>

                    {/* Editable Note (PDF Req 3) */}
                    <td className="px-4 py-4">
                       <input 
                         type="text" 
                         value={record.note || ''}
                         onChange={(e) => handleNoteChange(record.id, e.target.value)}
                         placeholder={t('att.placeholder.note')}
                         className="w-full text-sm border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none bg-transparent transition-colors py-1 text-slate-600 placeholder:text-slate-300"
                       />
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                       <Download size={24} className="text-slate-300" />
                    </div>
                    <p>No records found for {filterDate}.</p>
                    <p className="text-xs mt-1">Try changing the date filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Disclaimer (PDF Req 8) */}
      <div className="text-xs text-slate-400 text-center pb-4">
         * Attendance records are for reference only. Payroll is calculated based on the approved Shift Table.
      </div>
    </div>
  );
};

export default AttendanceList;
