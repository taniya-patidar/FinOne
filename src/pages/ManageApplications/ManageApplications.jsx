import React from "react";
import { addNotification } from "../../services/notificationService";

const ManageApplications = () => {
  const handleStatusChange = (appId, applicantName, newStatus) => {
    const type = newStatus.toLowerCase() === "approved" ? "approved" : "rejected";

    addNotification(
      `Application ${newStatus}`,
      `Loan Application ${appId} for ${applicantName} has been ${newStatus}.`,
      type
    );
  };

  return (
    <div>
      {/* Component UI */}
    </div>
  );
};

// Ensure this export statement exists at the end of the file:
export default ManageApplications;