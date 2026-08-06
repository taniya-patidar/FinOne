import './RecentEmiPayment.css'



const emiPayments = [
  {
    customerName: "Rahul Sharma",
    loanId: "LN1001",
    amount: "₹25,000",
    date: "15 May 2025",
    status: "Paid",
  },
  {
    customerName: "Priya Patel",
    loanId: "LN1002",
    amount: "₹18,500",
    date: "14 May 2025",
    status: "Pending",
  },
  {
    customerName: "Aman Verma",
    loanId: "LN1003",
    amount: "₹12,000",
    date: "13 May 2025",
    status: "Overdue",
  },
  {
    customerName: "Neha Singh",
    loanId: "LN1004",
    amount: "₹30,000",
    date: "12 May 2025",
    status: "Paid",
  },
  
];

function RecentEmiPayment() {
  return (
    <div className="recent-loan-table">
      <div className="table-header">
        <h3>Recent EMI Payments</h3>

        <button className="view-all-btn">
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
          {emiPayments.map((emi) => (
            <tr key={emi.loanId}>
              

              <td>
                <div className="customer-info">

                  <span>{emi.customerName}</span>
                </div>
              </td>

              <td>{emi.loanId}</td>

              <td>{emi.amount}</td>

              <td>{emi.date}</td>

              <td>
                <span
                  className={`status ${emi.status.toLowerCase()}`}
                >
                  {emi.status}
                </span>
              </td>

             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentEmiPayment;