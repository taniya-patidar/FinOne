import React, { useState, useEffect } from "react";
import "./ChartsSection.css";

const defaultTopLoanProducts = [
  { id: 1, name: "Home Loan", amount: "₹10.25 Cr", percentage: 42 },
  { id: 2, name: "Business Loan", amount: "₹6.80 Cr", percentage: 28 },
  { id: 3, name: "Personal Loan", amount: "₹4.35 Cr", percentage: 18 },
  { id: 4, name: "Vehicle Loan", amount: "₹2.30 Cr", percentage: 9 },
  { id: 5, name: "Education Loan", amount: "₹0.88 Cr", percentage: 3 },
];

const TopLoanPRoducts = () => {
  const [productsData, setProductsData] = useState(defaultTopLoanProducts);

  const calculateTopProducts = () => {
    const savedApps = JSON.parse(
      localStorage.getItem("loanApplications") || "[]"
    );

    if (savedApps && savedApps.length > 0) {
      // Categories tracking object
      const categories = {
        "Home Loan": { amount: 0, count: 0 },
        "Business Loan": { amount: 0, count: 0 },
        "Personal Loan": { amount: 0, count: 0 },
        "Vehicle Loan": { amount: 0, count: 0 },
        "Education Loan": { amount: 0, count: 0 },
      };

      let grandTotalAmount = 0;

      savedApps.forEach((app) => {
        const rawType = (app.loanType || app.type || "").toString().toLowerCase();
        // Extract amount safely, removing currency symbols/commas if any
        const numericAmount = parseFloat(
          String(app.loanAmount || app.amount || 0).replace(/[^0-9.]/g, "")
        ) || 0;

        let categoryKey = "Personal Loan";

        if (rawType.includes("home") || rawType.includes("house")) {
          categoryKey = "Home Loan";
        } else if (
          rawType.includes("vehicle") ||
          rawType.includes("car") ||
          rawType.includes("auto")
        ) {
          categoryKey = "Vehicle Loan";
        } else if (rawType.includes("business") || rawType.includes("biz")) {
          categoryKey = "Business Loan";
        } else if (
          rawType.includes("education") ||
          rawType.includes("student")
        ) {
          categoryKey = "Education Loan";
        }

        categories[categoryKey].amount += numericAmount;
        categories[categoryKey].count += 1;
        grandTotalAmount += numericAmount;
      });

      // Format Amount for display
      const formatAmount = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
        return `₹${val.toLocaleString("en-IN")}`;
      };

      // Transform object to array and calculate percentage
      const dynamicProducts = Object.keys(categories).map((name, index) => {
        const catAmount = categories[name].amount;
        const pct = grandTotalAmount > 0 
        ? parseFloat(((catAmount / grandTotalAmount) * 100).toFixed(1)) // 1 decimal point tak (e.g., 14.3%)
        : 0;

        return {
          id: index + 1,
          name,
          amount: formatAmount(catAmount),
          rawAmount: catAmount,
          percentage: pct,
        };
      });

      // Sort by amount descending (highest top product first)
      dynamicProducts.sort((a, b) => b.rawAmount - a.rawAmount);

      setProductsData(dynamicProducts);
    } else {
      setProductsData(defaultTopLoanProducts);
    }
  };

  useEffect(() => {
    calculateTopProducts();

    window.addEventListener("storage", calculateTopProducts);
    window.addEventListener("focus", calculateTopProducts);

    return () => {
      window.removeEventListener("storage", calculateTopProducts);
      window.removeEventListener("focus", calculateTopProducts);
    };
  }, []);

  return (
    <div className="top-loan-card">
      <div className="card-header">
        <h3>Top Loan Products</h3>
      </div>

      <div className="loan-list">
        {productsData.map((item) => (
          <div className="loan-item" key={item.id}>
            <div className="loan-details">
              <span className="loan-name">{item.name}</span>
              <span className="loan-amount">{item.amount}</span>
              <span className="loan-percent">{item.percentage}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${item.percentage}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLoanPRoducts;