# HR Lite - Clinic Operation System 🏥

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**HR Lite** is a specialized Human Resources Management prototype designed specifically for medical clinics and small healthcare facilities. It bridges the gap between complex enterprise ERPs and manual paperwork, offering a streamlined experience for both administrators and medical staff.

---

## 🌟 Key Philosophy

Clinics often face unique challenges: split shifts, multi-level approval needs, and strict labor law requirements (such as the "Labor Record Card" in Taiwan). **HR Lite** addresses these by providing:
- **Compliance First**: Automated generation of Wage Registers and Labor Cards.
- **LINE Integration Style**: A mobile interface that feels like a chat app, reducing the learning curve for staff.
- **Flexible Scheduling**: Support for 4-week "Flexible Work Hours" (變形工時).

---

## 🛠 Features

### 👨‍💼 Admin Dashboard (Web)
- **Dashboard Overview**: Real-time stats on attendance, pending leaves, and weekly overtime trends.
- **Smart Scheduling**: 4-week grid view with status-coded shift types (Morning, Evening, Split, etc.).
- **Attendance Audit**: Compare scheduled shifts vs. actual GPS/WiFi clock-in logs with one-click verification.
- **Compliance Payroll**: 
  - **3-Column Payslip**: Clear breakdown of (A) Fixed Salary, (B) Variable Payments, and (C) Deductions.
  - **Wage Register**: High-contrast, exportable register meeting regulatory standards.
- **Employee Management**: Digital "Labor Record Cards" with document attachments (ID copies, certificates).

### 📱 Employee Interface (Mobile/LINE-style)
- **Rich Menu Navigation**: Intuitive grid-based navigation mimicking the LINE bot experience.
- **Hybrid Clock-In**: Verified打卡 using Office WiFi SSID detection and GPS distance tracking.
- **Secure Payslip**: PIN-protected (Default: `0000`) access to monthly earnings.
- **Leave Management**: Submit requests with photo attachments (e.g., medical certificates) and track approval status.
- **Team Schedule**: View not just your own roster, but see who is on duty today.

---

## 🌍 Localization (i18n)
Full support for three languages:
- 🇺🇸 **English**
- 🇹🇼 **Traditional Chinese (繁體中文)**
- 🇯🇵 **Japanese (日本語)**

---

## 🚀 Tech Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Utility-first UI)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router 7
- **State Management**: React Context API

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hr-lite-clinic.git
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   bun dev
   ```

### Demo Credentials
- **Admin Access**: `admin` / `admin`
- **Employee Security PIN**: `0000`

---

## 📂 Project Structure
```text
src/
├── components/
│   ├── Admin/         # Dashboard, Schedule, Payroll, Employee List
│   ├── Mobile/        # Home, Check-In, Payslip, Leave
│   └── Layout/        # Responsive Web & Mobile Frames
├── AppContext.tsx     # Global State (i18n, Mock Data)
├── types.ts           # Shared TypeScript Interfaces
├── constants.ts       # Shift types and Initial Mock Data
└── translations.ts    # Multi-language Dictionary
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ for Healthcare Professionals.
