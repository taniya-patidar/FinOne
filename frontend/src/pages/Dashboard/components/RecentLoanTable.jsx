import React, { useState, useEffect } from "react";
import "./RecentLoanTable.css";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentLoanTable() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);

  const loadLoans = () => {
    // LocalStorage se raw data fetch karein
    const savedApps = JSON.parse(localStorage.getItem("loanApplications") || "[]");

    // Purely dynamic format - Agar localStorage empty hai to empty list hi set hogi
    const formatted = savedApps.map((app, idx) => ({
      id: app.id || idx + 1,
      customerId: app.customerId || `CUST-${1000 + (app.id || idx + 1)}`,
      // Agar profile image na ho to generic placeholder UI breakdown na hone de
      image: app.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name || app.applicantName || "User")}&background=random`,
      customer: app.name || app.applicantName || "Applicant",
      loanType: app.loanType || "Personal",
      amount: typeof app.loanAmount === "number" ? `₹${app.loanAmount.toLocaleString("en-IN")}` : app.loanAmount || "₹0",
      status: app.status || "Pending",
      date: app.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    }));

    // Sirf dynamic stored applications set hongi
    setLoans(formatted.slice(0, 7));
  };

  useEffect(() => {
    loadLoans();
    window.addEventListener("storage", loadLoans);
    window.addEventListener("focus", loadLoans);

    return () => {
      window.removeEventListener("storage", loadLoans);
      window.removeEventListener("focus", loadLoans);
    };
  }, []);

  return (
    <section className="loan-table-card">
      <div className="table-header">
        <h2>Recent Loan Applications</h2>
        <button className="view-btn" onClick={() => navigate("/LoanApplication")}>
          View All
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <tr key={loan.id}>
                  <td>
                    <span className="customer-id">{loan.customerId}</span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <img src={loan.image} alt={loan.customer} />
                      <span>{loan.customer}</span>
                    </div>
                  </td>
                  <td>{loan.loanType}</td>
                  <td>{loan.amount}</td>
                  <td>
                    <span className={`status ${(loan.status || "pending").toLowerCase()}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td>{loan.date}</td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={() => navigate(`/loans/${loan.id}`)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  No recent loan applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentLoanTable;