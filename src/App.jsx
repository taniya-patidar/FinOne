import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardLayout from "./components/Layout/DashboardLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import LoanApplication from "./pages/LoanApplication/LoanApplication";
import Notification from "./Pages/Notification/Notification";
import EmiSchedule from "./pages/EmiSchedule/EmiSchedule";

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

      </Route>

    </Routes>
  );
};

export default App;