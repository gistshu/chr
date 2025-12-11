
export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export type Language = 'en' | 'zh' | 'ja';

export interface EmployeeDocument {
  id: string;
  name: string;
  url: string; // Base64 or URL
  uploadDate: string;
  type: string; // e.g., 'pdf', 'image'
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  department: string;
  jobTitle: string; 
  baseSalary: number;
  avatar: string;
  phone: string; 
  hireDate: string; // YYYY-MM-DD
  resignationDate?: string; // YYYY-MM-DD
  
  // Labor Record Card Fields (勞工名卡)
  gender?: 'Male' | 'Female' | 'Other'; // 性別
  birthday?: string; // 出生年月日
  idNumber?: string; // 身分證統一編號
  address?: string; // 住址
  education?: string; // 教育程度
  skills?: string; // 技術/專長
  experience?: string; // 經歷
  dependentsCount?: number; // 扶養親屬人數
  
  // Images & Files
  idCardFront?: string; // URL or Base64
  idCardBack?: string;  // URL or Base64
  documents?: EmployeeDocument[]; // Personal files
  
  laborInsuranceDate?: string; // 勞保投保日期
  healthInsuranceDate?: string; // 健保投保日期
  
  email?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bankAccount?: string;
}

export enum AttendanceStatus {
  ON_TIME = 'On Time',
  LATE = 'Late',
  EARLY_LEAVE = 'Early Leave',
  ABSENT = 'Absent'
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm (Raw Log)
  checkOut?: string; // HH:mm (Raw Log)
  
  // Admin Finalized Times (Actual Pay Hours)
  finalizedIn?: string; // HH:mm
  finalizedOut?: string; // HH:mm
  isVerified?: boolean; // Has admin confirmed this?

  status: AttendanceStatus;
  locationType: 'GPS' | 'WIFI';
  wifiSsid?: string; // e.g., "Clinic_Guest"
  gpsLocation?: string; // e.g., "25.0330, 121.5654"
  distance?: number; // meters from company
  note?: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Morning' | 'Afternoon' | 'Evening' | 'Full' | 'Off' | 'Split' | 'RestDay' | 'RegularLeave' | 'NationalHoliday' | 'Indigenous' | 'Sick' | 'Personal' | 'Comp' | 'Annual' | 'Maternity' | 'Prenatal' | 'Paternity' | 'Injury' | 'Family';
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approverLevel: number; // 1, 2, or 3
}

export interface SalaryItem {
  id: string;
  name: string;
  amount: number;
  type: 'ADDITION' | 'DEDUCTION';
}

export interface SalaryConfig {
  defaultItems: { name: string; type: 'ADDITION' | 'DEDUCTION'; defaultAmount: number }[];
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  
  // Stats
  workDays: number;
  totalOvertimeHours: number;

  // --- (A) Fixed Payments (約定薪資結構) ---
  baseSalary: number;
  mealAllowance: number;      // 伙食津貼
  fullAttendanceBonus: number;// 全勤獎金
  jobAllowance: number;       // 職務津貼
  
  // --- (B) Variable Payments (非固定支付項目) ---
  weekdayOvertimePay: number; // 平日加班費
  restDayOvertimePay: number; // 休息日加班費
  holidayOvertimePay: number; // 國定假日加班費
  unusedAnnualLeavePay: number; // 未休特休折現
  otherBonuses: number;       // 其他獎金/差旅
  transportAllowance: number; // 交通津貼 (sometimes fixed, put here for now)

  // --- (C) Deductions (應代扣項目) ---
  laborInsurance: number;     // 勞保費
  healthInsurance: number;    // 健保費
  pension: number;            // 勞退自提
  welfareFund: number;        // 職工福利金
  sickLeaveDeduction: number; // 病假扣款
  personalLeaveDeduction: number; // 事假扣款
  tax: number;                // 所得稅
  otherDeductions: number;    // 其他扣款

  // Totals
  subtotalA: number;
  subtotalB: number;
  subtotalC: number;
  
  grossSalary: number;        // A + B
  totalDeductions: number;    // C
  netSalary: number;          // A + B - C
  
  isLocked: boolean; 
}