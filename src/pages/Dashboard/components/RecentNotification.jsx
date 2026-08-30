import "./RecentNotification.css";
import { Navigate, useNavigate } from "react-router-dom";

import {
  CheckCircle,
  Clock3,
  XCircle,
  UserPlus,
  CreditCard,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: <CheckCircle size={18} />,
    title: "Loan Application Approved",
    message: "Rahul Sharma's Home Loan has been approved.",
    time: "2 min ago",
    type: "success",
  },
  {
    id: 2,
    icon: <Clock3 size={18} />,
    title: "New Loan Application",
    message: "Priya Patel submitted a Personal Loan request.",
    time: "10 min ago",
    type: "warning",
  },
  {
    id: 3,
    icon: <CreditCard size={18} />,
    title: "EMI Payment Received",
    message: "₹25,000 EMI received from Aman Verma.",
    time: "20 min ago",
    type: "info",
  },
  {
    id: 4,
    icon: <XCircle size={18} />,
    title: "Loan Rejected",
    message: "Business Loan request of Neha Singh rejected.",
    time: "35 min ago",
    type: "danger",
  },
  {
    id: 5,
    icon: <UserPlus size={18} />,
    title: "New Customer Registered",
    message: "Vikash Gupta has created a new account.",
    time: "1 hour ago",
    type: "primary",
  },
];

function RecentNotification() {
  const navigate = useNavigate();
  return (
    <div className="notification-card">
      <div className="notification-header">
        <h3>Recent Notifications</h3>

        <button className="view-all-btn" onClick={()=> navigate('/notifications')}>
          View All
        </button>
      </div>

      <div className="notification-list">
        {notifications.map((item) => (
          <div className="notification-item" key={item.id}>
            <div className={`notification-icon ${item.type}`}>
              {item.icon}
            </div>

            <div className="notification-content">
              <h4>{item.title}</h4>
              <p>{item.message}</p>
            </div>

            <span className="notification-time">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentNotification;
