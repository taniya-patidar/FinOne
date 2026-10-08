import { Routes, Route } from "react-router-dom";

// Auth Components
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import Logout from "./pages/auth/Logout";

// Layout
import DashboardLayout from "./components/Layout/DashboardLayout";

// Dashboard & Feature Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import LoanApplication from "./pages/LoanApplication/LoanApplication";
import CustomerList from "./pages/CustomerManagement/CustomerList";
import CustomerForm from "./pages/CustomerManagement/CustomerForm";
import CustomerDetail from "./pages/CustomerManagement/CustomerDetail";
import CustomerEdit from "./pages/CustomerManagement/CustomerEdit";
import NewLoanApplication from "./pages/LoanApplication/NewLoanApplication";
import LoanApplicationEdit from "./pages/LoanApplication/LoanApplicationEdit";
import LoanApplicationView from "./pages/LoanApplication/LoanApplicationView";
import LoanApproval from "./pages/LoanApproval/LoanApproval";
import LoanApprovalReview from "./pages/LoanApproval/LoanApprovalReview";
import LoanApprovalHistory from "./pages/LoanApproval/LoanApprovalHistory";
import ReportsPage from "./pages/Reports/ReportsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import ApplyLoanForm from "./pages/ApplyLoan/ApplyLoanForm";
import ManageApplications from "./pages/ManageApplications/ManageApplications";
import EMISchedule from "./pages/EmiSchedule/EmiSchedule";

const App = () => {
  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* PROTECTED DASHBOARD ROUTES */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Loan Applications */}
        <Route path="/loanApplication" element={<LoanApplication />} />
        <Route path="/loans/add" element={<NewLoanApplication />} />
        <Route path="/loans/:id/edit" element={<LoanApplicationEdit />} />
        <Route path="/loans/:id" element={<LoanApplicationView />} />
        <Route path="/apply-loan" element={<ApplyLoanForm />} />
        <Route path="/manage-applications" element={<ManageApplications />} />

        {/* EMI Schedule */}
        <Route path="/EmiSchedule" element={<EMISchedule />} />

        {/* Customer Management */}
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/add" element={<CustomerForm />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/customers/:id/edit" element={<CustomerEdit />} />

        {/* Approvals */}
        <Route path="/loan-approval" element={<LoanApproval />} />
        <Route path="/loan-details/:id" element={<LoanApprovalReview />} />
        <Route path="/loan-approval/history" element={<LoanApprovalHistory />} />

        {/* System & Reports */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/Notification" element={<NotificationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default App;