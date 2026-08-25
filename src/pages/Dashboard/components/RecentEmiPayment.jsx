import React, { useState, useEffect } from "react";
import "./RecentEmiPayment.css";
import { useNavigate } from "react-router-dom";

function RecentEmiPayment() {
  const navigate = useNavigate();
  const [emiPayments, setEmiPayments] = useState([]);

  const loadEmiData = () => {
    const savedSchedules = JSON.parse(localStorage.getItem("approvedEMISchedules") || "[]");

    if (savedSchedules.length > 0) {
      const formattedData = savedSchedules.map((item, index) => {
        let status = "Pending";
        if (item.paymentDate) {
          status = "Paid";
        } else if (item.dueDate && new Date(item.dueDate) < new Date()) {
          status = "Overdue";
        }

        return {
          customerName: item.customerName || "Customer",
          loanId: item.id || `LN100${index + 1}`,
          amount: typeof item.emiAmount === "number" ? `₹${item.emiAmount.toLocaleString("en-IN")}` : item.emiAmount || "₹0",
          date: item.dueDate || "N/A",
          status: status
        };
      });

      // Strictly top 5 starting rows fetch hongi
      setEmiPayments(formattedData.slice(0, 5));
    } else {
      setEmiPayments([]);
    }
  };

  useEffect(() => {
    loadEmiData();
    window.addEventListener("storage", loadEmiData);
    window.addEventListener("focus", loadEmiData);

    return () => {
      window.removeEventListener("storage", loadEmiData);
      window.removeEventListener("focus", loadEmiData);
    };
  }, []);

  return (
    <div className="recent-loan-table">
      <div className="table-header">
        <h3>Recent EMI Payments</h3>
        <button className="view-all-btn" onClick={() => navigate("/EmiSchedule")}>
          View All
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Loan ID</th>
            <th>EMI Amount</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {emiPayments.length > 0 ? (
            emiPayments.slice(0, 5).map((emi, index) => (
              <tr key={emi.loanId || index}>
                <td>
                  <div className="customer-info">
                    <span>{emi.customerName}</span>
                  </div>
                </td>
                <td>{emi.loanId}</td>
                <td>{emi.amount}</td>
                <td>{emi.date}</td>
                <td>
                  <span className={`status ${emi.status.toLowerCase()}`}>
                    {emi.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "15px", color: "#888" }}>
                No EMI data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentEmiPayment;