
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, AttendanceRecord, Shift, LeaveRequest, PayrollRecord, LeaveStatus, AttendanceStatus, Language } from './types';
import { EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_LEAVE_REQUESTS, CURRENT_USER_ID, SHIFT_TYPES } from './constants';
import { TRANSLATIONS } from './translations';

interface AppContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  shifts: Shift[];
  currentUser: Employee;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  addAttendance: (record: AttendanceRecord) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;
  generatePayroll: (month: string) => PayrollRecord[];
  getPayrollHistory: (empId: string) => PayrollRecord[];
  calculatePayroll: (month: string) => void;
  updatePayrollRecord: (id: string, updates: Partial<PayrollRecord>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [language, setLanguage] = useState<Language>('zh'); 
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  
  // Generate some mock shifts dynamically for the current month
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const generated: Shift[] = [];
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const availableTypes = Object.keys(SHIFT_TYPES).filter(k => k !== 'RestDay' && k !== 'RegularLeave');

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const day = d.getDay();
      employees.forEach(emp => {
        let type = 'Full';
        if (day === 0) type = 'RegularLeave';
        else if (day === 6) type = 'RestDay';
        else {
           if (Math.random() > 0.9) {
              type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
           } else {
              type = Math.random() > 0.5 ? 'Full' : 'Morning';
           }
        }

        const shiftConfig = SHIFT_TYPES[type as keyof typeof SHIFT_TYPES];
        generated.push({
          id: `S-${emp.id}-${dateStr}`,
          employeeId: emp.id,
          date: dateStr,
          startTime: shiftConfig.start,
          endTime: shiftConfig.end,
          type: type as any,
        });
      });
    }
    return generated;
  });

  const currentUser = employees.find(e => e.id === CURRENT_USER_ID) || employees[0];

  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || key;
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance(prev => [...prev, record]);
  };

  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaves(prev => [request, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const createMockRecord = (emp: Employee, month: string): PayrollRecord => {
      // Logic for 3-column payslip structure
      const baseSalary = emp.baseSalary;
      const mealAllowance = 2400;
      const fullAttendanceBonus = Math.random() > 0.2 ? 1000 : 0;
      const jobAllowance = emp.role === 'ADMIN' ? 5000 : 1000;
      const transportAllowance = 1200;
      
      const subtotalA = baseSalary + mealAllowance + fullAttendanceBonus + jobAllowance;

      const totalOvertimeHours = Math.floor(Math.random() * 8);
      const weekdayOvertimePay = Math.floor(totalOvertimeHours * (baseSalary / 240 * 1.33));
      const restDayOvertimePay = Math.random() > 0.8 ? 1500 : 0;
      const holidayOvertimePay = 0;
      const unusedAnnualLeavePay = 0;
      const otherBonuses = Math.random() > 0.9 ? 2000 : 0;
      
      const subtotalB = weekdayOvertimePay + restDayOvertimePay + holidayOvertimePay + unusedAnnualLeavePay + otherBonuses + transportAllowance;

      const laborInsurance = Math.floor(baseSalary * 0.02); 
      const healthInsurance = Math.floor(baseSalary * 0.015);
      const pension = 0; // Voluntary
      const welfareFund = Math.floor(baseSalary * 0.005);
      const tax = baseSalary > 50000 ? Math.floor(baseSalary * 0.05) : 0;
      const sickLeaveDeduction = Math.random() > 0.9 ? Math.floor(baseSalary / 30 / 2) : 0;
      const personalLeaveDeduction = 0;
      const otherDeductions = 0;

      const subtotalC = laborInsurance + healthInsurance + pension + welfareFund + tax + sickLeaveDeduction + personalLeaveDeduction + otherDeductions;

      return {
        id: `P-${emp.id}-${month}`,
        employeeId: emp.id,
        month,
        
        workDays: 22,
        totalOvertimeHours,
        
        // A
        baseSalary,
        mealAllowance,
        fullAttendanceBonus,
        jobAllowance,
        
        // B
        weekdayOvertimePay,
        restDayOvertimePay,
        holidayOvertimePay,
        unusedAnnualLeavePay,
        otherBonuses,
        transportAllowance,

        // C
        laborInsurance,
        healthInsurance,
        pension,
        welfareFund,
        tax,
        sickLeaveDeduction,
        personalLeaveDeduction,
        otherDeductions,

        subtotalA,
        subtotalB,
        subtotalC,
        
        grossSalary: subtotalA + subtotalB,
        totalDeductions: subtotalC,
        netSalary: (subtotalA + subtotalB) - subtotalC,
        
        isLocked: false
      };
  };

  const generatePayroll = (month: string): PayrollRecord[] => {
    // Return existing or generate new
    const existing = payrollRecords.filter(r => r.month === month);
    if (existing.length > 0) return existing;

    const newRecords = employees.map(emp => createMockRecord(emp, month));
    setPayrollRecords(prev => [...prev, ...newRecords]);
    return newRecords;
  };

  const calculatePayroll = (month: string) => {
      // Trigger to generate/update records for the specific month
      const records = generatePayroll(month);
      // In a real app, this would recalculate based on updated attendance
      setPayrollRecords(prev => {
          const others = prev.filter(r => r.month !== month);
          return [...others, ...records];
      });
  };

  const getPayrollHistory = (empId: string): PayrollRecord[] => {
      // Generate some fake history if none exists
      const months = ['2023-09', '2023-08', '2023-07'];
      months.forEach(m => {
          if (!payrollRecords.some(r => r.employeeId === empId && r.month === m)) {
              const emp = employees.find(e => e.id === empId);
              if (emp) {
                 const rec = createMockRecord(emp, m);
                 rec.isLocked = true; // Historical are locked
                 setPayrollRecords(prev => [...prev, rec]);
              }
          }
      });
      return payrollRecords.filter(r => r.employeeId === empId).sort((a,b) => b.month.localeCompare(a.month));
  };

  const updatePayrollRecord = (id: string, updates: Partial<PayrollRecord>) => {
    setPayrollRecords(prev => prev.map(r => {
        if (r.id === id) {
            const updated = { ...r, ...updates };
            // Recalculate totals
            updated.subtotalA = updated.baseSalary + updated.mealAllowance + updated.fullAttendanceBonus + updated.jobAllowance;
            
            updated.subtotalB = updated.weekdayOvertimePay + updated.restDayOvertimePay + updated.holidayOvertimePay + 
                                updated.unusedAnnualLeavePay + updated.otherBonuses + updated.transportAllowance;
            
            updated.subtotalC = updated.laborInsurance + updated.healthInsurance + updated.pension + updated.welfareFund + 
                                updated.tax + updated.sickLeaveDeduction + updated.personalLeaveDeduction + updated.otherDeductions;
            
            updated.grossSalary = updated.subtotalA + updated.subtotalB;
            updated.totalDeductions = updated.subtotalC;
            updated.netSalary = updated.grossSalary - updated.totalDeductions;
            return updated;
        }
        return r;
    }));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const updateShift = (shiftId: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(s => s.id === shiftId ? { ...s, ...updates } : s));
  };

  return (
    <AppContext.Provider value={{
      employees,
      attendance,
      leaves,
      shifts,
      currentUser,
      language,
      setLanguage,
      t,
      addAttendance,
      updateAttendance,
      addLeaveRequest,
      updateLeaveStatus,
      generatePayroll,
      getPayrollHistory,
      calculatePayroll,
      updatePayrollRecord,
      updateEmployee,
      updateShift
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
