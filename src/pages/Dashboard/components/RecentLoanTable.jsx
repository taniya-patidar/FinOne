import "./RecentLoanTable.css";
import { Eye } from "lucide-react";

import user1 from "../../../assets/users/user1.jpg";
import user2 from "../../../assets/users/user2.jpg";
import user3 from "../../../assets/users/user3.jpg";
import user4 from "../../../assets/users/user4.jpg";
import user5 from "../../../assets/users/user5.jpg";
import user6 from "../../../assets/users/user6.jpg";

const loanData = [
  {
    id: 1,
    customerId: "CUST-1001",
    image: user1,
    customer: "Rahul Sharma",
    loanType: "Personal",
    amount: "₹2,50,000",
    status: "Approved",
    date: "06 Aug 2026",
  },
  {
    id: 2,
    customerId: "CUST-1002",
    image: user2,
    customer: "Priya Patel",
    loanType: "Home",
    amount: "₹15,00,000",
    status: "Pending",
    date: "05 Aug 2026",
  },
  {
    id: 3,
    customerId: "CUST-1003",
    image: user3,
    customer: "Aman Verma",
    loanType: "Vehicle",
    amount: "₹8,20,000",
    status: "Rejected",
    date: "04 Aug 2026",
  },
  {
    id: 4,
    customerId: "CUST-1004",
    image: user4,
    customer: "Neha Singh",
    loanType: "Education",
    amount: "₹4,00,000",
    status: "Approved",
    date: "03 Aug 2026",
  },
  {
    id: 5,
    customerId: "CUST-1005",
    image: user5,
    customer: "Rohit Jain",
    loanType: "Business",
    amount: "₹12,00,000",
    status: "Pending",
    date: "02 Aug 2026",
  },
   {
    id: 6,
    customerId: "CUST-1006",
    image: user6,
    customer: "Tanu Jain",
    loanType: "Business",
    amount: "₹12,00,000",
    status: "Pending",
    date: "02 Aug 2026",
  },
   {
    id: 7,
    customerId: "CUST-1006",
    image: user3,
    customer: "Priti Jain",
    loanType: "Business",
    amount: "₹16,00,000",
    status: "Pending",
    date: "02 Aug 2026",
  },
  
];

function RecentLoanTable() {
  return (
    <section className="loan-table-card">

      <div className="table-header">
        <h2>Recent Loan Applications</h2>

        <button className="view-btn">
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

            {loanData.map((loan) => (

              <tr key={loan.id}>

                <td>
                  <span className="customer-id">
                    {loan.customerId}
                  </span>
                </td>

                <td>

                  <div className="customer-info">

                    <img
                      src={loan.image}
                      alt={loan.customer}
                    />

                    <span>{loan.customer}</span>

                  </div>

                </td>

                <td>{loan.loanType}</td>

                <td>{loan.amount}</td>

                <td>

                  <span
                    className={`status ${loan.status.toLowerCase()}`}
                  >
                    {loan.status}
                  </span>

                </td>

                <td>{loan.date}</td>

                <td>

                  <button className="action-btn">
                    <Eye size={18}/>
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default RecentLoanTable;