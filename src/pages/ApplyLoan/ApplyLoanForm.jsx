import React, { useState } from "react";
import { addNotification } from "../../services/notificationService";

const ApplyLoanForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    loanType: "Personal Loan",
    loanAmount: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // 1. Save application to localStorage (or backend)
    const existingApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const newApplication = { id: Date.now(), ...formData, status: "Pending" };
    localStorage.setItem("loanApplications", JSON.stringify([newApplication, ...existingApplications]));

    // 2. Trigger Notification
    addNotification(
      "New Loan Application Submitted", 
      `${formData.name} applied for a ${formData.loanType} of ₹${Number(formData.loanAmount).toLocaleString('en-IN')}`, 
      "application"
    );

    // 3. Reset form or navigate
    alert("Application submitted successfully!");
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Your form fields */}
    </form>
  );
};

export default ApplyLoanForm;