import { Routes, Route } from "react-router-dom";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardLayout from "./components/Layout/DashboardLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import LoanApplication from "./pages/LoanApplication/LoanApplication";
import Notification from "./Pages/Notification/Notification";
import EmiSchedule from "./pages/EmiSchedule/EmiSchedule";
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


const App = () => {
  return (
    <Routes>

      {/* =========================
          AUTH ROUTES
      ========================= */}

      <Route path="/" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =========================
          DASHBOARD LAYOUT
      ========================= */}

      <Route element={<DashboardLayout />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/LoanApplication"
          element={<LoanApplication />}
        />

        <Route
          path="/Notification"
          element={<Notification />}
        />

        <Route
          path="/EmiSchedule"
          element={<EmiSchedule />}
        />
         <Route
          path="/customers"
          element={<CustomerList />}
        />
        <Route path="/customers/add" element={<CustomerForm />} />

        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/customers/:id/edit" element={<CustomerEdit />} />
        <Route path="/loanApplication" element={<LoanApplication/>}/>
        <Route path="/loans/add" element={<NewLoanApplication/>}/>
        <Route path="/loans/:id/edit" element={<LoanApplicationEdit/>}/>
        <Route path="/loans/:id" element={<LoanApplicationView/>} />
        <Route path="/loan-approval" element={<LoanApproval/>} />
        <Route path='loan-details/:id' element={<LoanApprovalReview/>}/>
        <Route path="/loan-approval/history" element={<LoanApprovalHistory/>}/>

      </Route>

    </Routes>
  );
};

export default App;