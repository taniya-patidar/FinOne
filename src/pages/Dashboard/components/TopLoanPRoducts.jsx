import React from 'react'
import './ChartsSection.css'

const TopLoanPRoducts = () => {

    const topLoanProducts = [
  {
    id: 1,
    name: "Home Loan",
    amount: "₹10.25 Cr",
    percentage: 42
  },
  {
    id: 2,
    name: "Business Loan",
    amount: "₹6.80 Cr",
    percentage: 28
  },
  {
    id: 3,
    name: "Personal Loan",
    amount: "₹4.35 Cr",
    percentage: 18
  },
  {
    id: 4,
    name: "Vehicle Loan",
    amount: "₹2.30 Cr",
    percentage: 9
  },
  {
    id: 5,
    name: "Education Loan",
    amount: "₹0.88 Cr",
    percentage: 3
  }
];
  return (
    
     <div className="top-loan-card">

      <div className="card-header">
        <h3>Top Loan Products</h3>
      </div>

      <div className="loan-list">

        {topLoanProducts.map((item) => (

          <div className="loan-item" key={item.id}>

            <div className="loan-details">

              <span className="loan-name">
                {item.name}
              </span>

              <span className="loan-amount">
                {item.amount}
              </span>

              <span className="loan-percent">
                {item.percentage}%
              </span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${item.percentage}%`
                }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};


export default TopLoanPRoducts
