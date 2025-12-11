
import { Employee, Role, AttendanceRecord, Shift, LeaveRequest, LeaveStatus, AttendanceStatus, SalaryConfig } from './types';

export const CURRENT_USER_ID = 'E002'; // Simulating logged-in employee (Jane Doe)

export const EMPLOYEES: Employee[] = [
  { 
    id: 'E001', 
    name: 'Dr. Sarah Chen', 
    role: Role.ADMIN, 
    department: 'Medical', 
    jobTitle: 'Head Physician',
    baseSalary: 120000, 
    avatar: 'https://picsum.photos/id/64/100/100',
    phone: '0912-345-678',
    hireDate: '2020-05-15',
    email: 'sarah.chen@clinic.com',
    idNumber: 'A223456789',
    gender: 'Female',
    birthday: '1985-04-12',
    address: 'No. 1, Main St, Taipei City',
    education: 'Ph.D. in Medicine, NTU',
    skills: 'Internal Medicine, Surgery',
    experience: 'Resident at Taipei Gen Hospital (5 years)',
    laborInsuranceDate: '2020-05-15',
    healthInsuranceDate: '2020-05-15',
    dependentsCount: 1,
    documents: [
      { id: 'D1', name: 'Medical License.pdf', url: '#', uploadDate: '2020-05-15', type: 'pdf' },
      { id: 'D2', name: 'Employment Contract.pdf', url: '#', uploadDate: '2020-05-15', type: 'pdf' }
    ]
  },
  { 
    id: 'E002', 
    name: 'Jane Doe', 
    role: Role.EMPLOYEE, 
    department: 'Nursing', 
    jobTitle: 'Senior Nurse',
    baseSalary: 45000, 
    avatar: 'https://picsum.photos/id/65/100/100',
    phone: '0922-456-789',
    hireDate: '2021-03-01',
    email: 'jane.doe@clinic.com',
    idNumber: 'F223456789',
    gender: 'Female',
    birthday: '1992-08-23',
    address: 'No. 123, Xinyi Rd, Taipei City',
    education: 'Bachelor of Nursing',
    skills: 'CPR, Patient Care, IV Administration',
    experience: 'Junior Nurse at Local Clinic (2 years)',
    laborInsuranceDate: '2021-03-01',
    healthInsuranceDate: '2021-03-01',
    dependentsCount: 0,
    emergencyContact: 'John Doe',
    emergencyPhone: '0911-111-222',
    idCardFront: 'https://picsum.photos/id/1/300/200', // Mock ID
    documents: [
      { id: 'D3', name: 'Nursing Certificate.jpg', url: '#', uploadDate: '2021-03-01', type: 'image' }
    ]
  },
  { 
    id: 'E003', 
    name: 'John Smith', 
    role: Role.EMPLOYEE, 
    department: 'Admin', 
    jobTitle: 'Receptionist',
    baseSalary: 38000, 
    avatar: 'https://picsum.photos/id/61/100/100',
    phone: '0933-567-890',
    hireDate: '2022-08-10',
    email: 'john.smith@clinic.com',
    idNumber: 'A198765432',
    gender: 'Male',
    birthday: '1995-11-05',
    education: 'High School Diploma',
    skills: 'Customer Service, Excel',
    experience: 'Retail Associate (3 years)',
    laborInsuranceDate: '2022-08-10',
    healthInsuranceDate: '2022-08-10'
  },
  { 
    id: 'E004', 
    name: 'Emily Wang', 
    role: Role.EMPLOYEE, 
    department: 'Nursing', 
    jobTitle: 'Nurse Practitioner',
    baseSalary: 42000, 
    avatar: 'https://picsum.photos/id/75/100/100',
    phone: '0944-678-901',
    hireDate: '2021-11-20',
    email: 'emily.wang@clinic.com',
    idNumber: 'F298765432',
    gender: 'Female',
    laborInsuranceDate: '2021-11-20',
    healthInsuranceDate: '2021-11-20'
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { 
    id: 'A001', 
    employeeId: 'E002', 
    date: '2023-10-23', 
    checkIn: '08:55', 
    checkOut: '18:05', 
    status: AttendanceStatus.ON_TIME, 
    locationType: 'WIFI',
    wifiSsid: 'Clinic_Staff_5G',
    distance: 0
  },
  { 
    id: 'A002', 
    employeeId: 'E003', 
    date: '2023-10-23', 
    checkIn: '09:10', 
    checkOut: '18:00', 
    status: AttendanceStatus.LATE, 
    locationType: 'GPS', 
    gpsLocation: '25.0335° N, 121.5641° E',
    distance: 150,
    note: 'Traffic jam on highway' 
  },
  { 
    id: 'A003', 
    employeeId: 'E002', 
    date: '2023-10-24', 
    checkIn: '08:50', 
    checkOut: '18:00', 
    status: AttendanceStatus.ON_TIME, 
    locationType: 'WIFI',
    wifiSsid: 'Clinic_Staff_2.4G',
    distance: 2
  },
  {
    id: 'A004',
    employeeId: 'E004',
    date: '2023-10-23',
    checkIn: '08:45',
    checkOut: '17:30', // Early leave
    status: AttendanceStatus.EARLY_LEAVE,
    locationType: 'GPS',
    gpsLocation: '25.0330° N, 121.5654° E',
    distance: 50,
    note: 'Doctor appointment'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'L001', employeeId: 'E002', type: 'Annual', startDate: '2023-11-01', endDate: '2023-11-02', reason: 'Family trip', status: LeaveStatus.PENDING, approverLevel: 1 },
  { id: 'L002', employeeId: 'E004', type: 'Sick', startDate: '2023-10-20', endDate: '2023-10-20', reason: 'Flu', status: LeaveStatus.APPROVED, approverLevel: 2 },
];

// Expanded Shift Types based on request
export const SHIFT_TYPES = {
  // --- Work Shifts ---
  Morning: { start: '08:00', end: '16:00', color: 'bg-blue-100 text-blue-800 border-blue-200' }, // 早班
  Evening: { start: '14:00', end: '22:00', color: 'bg-purple-100 text-purple-800 border-purple-200' }, // 晚班
  Full: { start: '09:00', end: '18:00', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }, // 全班
  Split: { start: '10:00', end: '20:00', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' }, // 兩頭班 (Mock time span)

  // --- Regular Offs ---
  RestDay: { start: '-', end: '-', color: 'bg-gray-100 text-gray-500 border-gray-200' }, // 休假日
  RegularLeave: { start: '-', end: '-', color: 'bg-slate-200 text-slate-600 border-slate-300' }, // 例假日
  NationalHoliday: { start: '-', end: '-', color: 'bg-pink-100 text-pink-700 border-pink-200' }, // 國定假日
  Indigenous: { start: '-', end: '-', color: 'bg-rose-100 text-rose-700 border-rose-200' }, // 歲時祭儀假

  // --- Leaves ---
  Sick: { start: '-', end: '-', color: 'bg-red-50 text-red-700 border-red-200' }, // 病假
  Personal: { start: '-', end: '-', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' }, // 事假
  Comp: { start: '-', end: '-', color: 'bg-orange-50 text-orange-700 border-orange-200' }, // 補休
  Annual: { start: '-', end: '-', color: 'bg-teal-50 text-teal-700 border-teal-200' }, // 特休假
  
  // --- Special Leaves ---
  Maternity: { start: '-', end: '-', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' }, // 產假
  Prenatal: { start: '-', end: '-', color: 'bg-violet-100 text-violet-700 border-violet-200' }, // 產檢假
  Paternity: { start: '-', end: '-', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, // 陪產假
  Injury: { start: '-', end: '-', color: 'bg-red-100 text-red-800 border-red-300' }, // 公傷假
  Family: { start: '-', end: '-', color: 'bg-lime-100 text-lime-700 border-lime-200' }, // 家庭照顧假
};

export const INITIAL_APPROVAL_CONFIGS: Record<string, { l1: string, l2: string, l3: string }> = {
  'E002': { l1: 'E001', l2: '', l3: '' },
  'E003': { l1: 'E001', l2: '', l3: '' },
  'E004': { l1: 'E002', l2: 'E001', l3: '' },
};

export const DEFAULT_SALARY_CONFIG: SalaryConfig = {
  defaultItems: [
    { name: 'Transport Allowance', type: 'ADDITION', defaultAmount: 1000 },
    { name: 'Meal Allowance', type: 'ADDITION', defaultAmount: 2400 },
    { name: 'Full Attendance Bonus', type: 'ADDITION', defaultAmount: 1000 },
    { name: 'Welfare Fund', type: 'DEDUCTION', defaultAmount: 200 }
  ]
};
