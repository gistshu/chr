
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import AdminLayout from './components/Layout/AdminLayout';
import MobileLayout from './components/Layout/MobileLayout';
import Dashboard from './components/Admin/Dashboard';
import Schedule from './components/Admin/Schedule';
import AttendanceList from './components/Admin/AttendanceList';
import LeaveList from './components/Admin/LeaveList';
import EmployeeList from './components/Admin/EmployeeList'; 
import Payroll from './components/Admin/Payroll'; // New Import
import MobileHome from './components/Mobile/MobileHome';
import MobileCheckIn from './components/Mobile/MobileCheckIn';
import MobilePayslip from './components/Mobile/MobilePayslip';
import MobileLeave from './components/Mobile/MobileLeave';
import MobileSchedule from './components/Mobile/MobileSchedule';
import Login from './components/Login';

const AdminRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminLayout>{children}</AdminLayout>
);

const MobileRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MobileLayout>{children}</MobileLayout>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Landing redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRouteWrapper><Dashboard /></AdminRouteWrapper>} />
          <Route path="/admin/schedule" element={<AdminRouteWrapper><Schedule /></AdminRouteWrapper>} />
          <Route path="/admin/attendance" element={<AdminRouteWrapper><AttendanceList /></AdminRouteWrapper>} />
          <Route path="/admin/leaves" element={<AdminRouteWrapper><LeaveList /></AdminRouteWrapper>} />
          <Route path="/admin/payroll" element={<AdminRouteWrapper><Payroll /></AdminRouteWrapper>} />
          <Route path="/admin/employees" element={<AdminRouteWrapper><EmployeeList /></AdminRouteWrapper>} />

          {/* Mobile Routes */}
          <Route path="/mobile" element={<MobileRouteWrapper><MobileHome /></MobileRouteWrapper>} />
          <Route path="/mobile/checkin" element={<MobileRouteWrapper><MobileCheckIn /></MobileRouteWrapper>} />
          <Route path="/mobile/payslip" element={<MobileRouteWrapper><MobilePayslip /></MobileRouteWrapper>} />
          <Route path="/mobile/schedule" element={<MobileRouteWrapper><MobileSchedule /></MobileRouteWrapper>} />
          <Route path="/mobile/leave" element={<MobileRouteWrapper><MobileLeave /></MobileRouteWrapper>} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
