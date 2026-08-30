import  { useState, useEffect } from "react";
import { addNotification } from "../../services/notificationService";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  DollarSign,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Building,
} from "lucide-react";
import "./LoanApprovalReview.css";

const LoanApprovalReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [application, setApplication] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewerRemarks, setReviewerRemarks] = useState("");

  const [activeModal, setActiveModal] = useState(null);
  const [modalReason, setModalReason] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    setLoading(true);

    let currentApp = location.state?.applicationData;

    if (!currentApp) {
      const savedApps = JSON.parse(localStorage.getItem("loanApplications")) || [];
      currentApp = savedApps.find((app) => String(app.id) === String(id));
    }

    if (!currentApp) {
      currentApp = {
        id: id || "LA-10021",
        customerId: "CUST-10001",
        name: "Rahul Sharma",
        mobile: "9876543210",
        email: "rahul.sharma@email.com",
        loanType: "Home Loan",
        loanAmount: "₹ 8,50,000",
        interestRate: "9.25",
        loanTenure: "10 Years",
        emi: "11,234",
        status: "Pending Approval",
        appliedOn: "17 Aug 2025, 10:30 AM",
        creditScore: 765,
      };
    }

    setApplication(currentApp);

    const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
    const foundCustomer =
      savedCustomers.find((c) => String(c.id) === String(currentApp.customerId)) || savedCustomers[0];

    setCustomer(foundCustomer);
    setLoading(false);
  };

  if (loading || !application) {
    return <div className="review-loading">Loading application details...</div>;
  }

  const monthlyIncome = Number(customer?.employmentDetails?.monthlyIncome || 85000);
  const existingEmi = Number(application?.existingEmi) || 18000;
  const requestedEmi = Number(String(application?.emi || "11234").replace(/[^0-9.]/g, "")) || 11234;
  const totalObligations = existingEmi + requestedEmi;
  const foir = ((totalObligations / monthlyIncome) * 100).toFixed(2);
  
  // Dynamic values
  const creditScore = Number(application?.creditScore || 765);
  const loanType = application?.loanType || "Home Loan";

  // Arc Data (Green: 300-700, Orange: 700-800, Red: 800-900)
  const gaugeChartData = [
    { name: "Good", value: 400, color: "#10B981" },
    { name: "Average", value: 100, color: "#F59E0B" },
    { name: "Poor", value: 100, color: "#EF4444" },
  ];

  // Dynamic Needle Coordinates Calculation
  const minScore = 300;
  const maxScore = 900;
  const clampedScore = Math.max(minScore, Math.min(maxScore, creditScore));
  const percentage = (clampedScore - minScore) / (maxScore - minScore);
  const needleAngle = 180 - percentage * 180;

  const renderNeedle = (cx, cy, iR, oR) => {
    const RADIAN = Math.PI / 180;
    const radius = iR + (oR - iR) / 2;
    const x = cx + radius * Math.cos(-needleAngle * RADIAN);
    const y = cy + radius * Math.sin(-needleAngle * RADIAN);

    return (
      <g key="needle-group">
        <circle cx={cx} cy={cy} r={5} fill="#1E293B" />
        <line
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={x} cy={y} r={3} fill="#10B981" />
      </g>
    );
  };

  const handleDecisionSubmit = (statusType) => {
    if ((statusType === "Rejected" || statusType === "Need More Information") && !modalReason.trim()) {
      alert("Please enter a valid reason!");
      return;
    }

    const savedApps = JSON.parse(localStorage.getItem("loanApplications")) || [];
    const updatedApps = savedApps.map((app) => {
      if (String(app.id) === String(application.id)) {
        return {
          ...app,
          status: statusType,
          remarks: reviewerRemarks,
          decisionReason: modalReason,
          decisionDate: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
      }
      return app;
    });


    localStorage.setItem("loanApplications", JSON.stringify(updatedApps));

// 🔔 Create notification
let notificationTitle = "";
let notificationMessage = "";
let notificationType = "application";

if (statusType === "Approved") {
  notificationTitle = "Loan Application Approved";
  notificationMessage = `Application #${application.id} has been approved successfully.`;
  notificationType = "approved";
} else if (statusType === "Rejected") {
  notificationTitle = "Loan Application Rejected";
  notificationMessage = `Application #${application.id} has been rejected.`;
  notificationType = "rejected";
} else if (statusType === "Need More Information") {
  notificationTitle = "More Information Required";
  notificationMessage = `Additional information is required for Application #${application.id}.`;
  notificationType = "application";
}

addNotification(
  notificationTitle,
  notificationMessage,
  notificationType
);

alert(`Application ${application.id} marked as "${statusType}" successfully!`);
    setActiveModal(null);
    navigate("/loan-approval");
  };



  return (
    <div className="approval-review-container">
      <div className="review-header">
        <Link to="/loan-approval" className="back-link">
          <ArrowLeft size={16} /> Back to Loan Approval
        </Link>
        <div className="header-title-bar">
          <div className="title-left">
            <h1>
              Application Review <span className="app-id-pill">{application.id}</span>
            </h1>
            <p className="subtitle">Review loan application details and make approval decision</p>
          </div>
          <div className="header-status">
            <span className="pending-badge">{application.status || "Pending Approval"}</span>
            <span className="sub-date">Submitted on {application.appliedOn || "17 Aug 2025, 10:30 AM"}</span>
          </div>
        </div>
      </div>

      <div className="review-dashboard-grid">
        <div className="main-section">
          <div className="fin-card profile-card">
            <div className="profile-info-left">
              <div className="avatar">{(customer?.name || application?.name || "R").charAt(0)}</div>
              <div>
                <h2>{customer?.name || application?.name || "Rahul Sharma"}</h2>
                <div className="meta-info">
                  <span>📞 {customer?.mobile || "9876543210"}</span>
                  <span>✉️ {customer?.email || "rahul.sharma@email.com"}</span>
                  <span>📍 {customer?.addressInformation?.city || "Mumbai, Maharashtra"}</span>
                </div>
              </div>
            </div>
            <div className="profile-info-right">
              <div className="meta-col">
                <span className="label">Application ID</span>
                <span className="val">{application.id}</span>
                <span className="label" style={{ marginTop: "8px" }}>Loan Type</span>
                <span className="val">{loanType}</span>
              </div>
              <div className="meta-col">
                <span className="label">Employment Type</span>
                <span className="val">Salaried</span>
                <span className="label" style={{ marginTop: "8px" }}>Requested Amount</span>
                <span className="val">{application.loanAmount || "₹8,50,000"}</span>
              </div>
              <div className="meta-col">
                <span className="label">Credit Score</span>
                <span className="val score-green">{creditScore} <span className="tag">Good</span></span>
                <span className="label" style={{ marginTop: "8px" }}>Monthly Income</span>
                <span className="val">₹{monthlyIncome.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="grid-2col">
            <div className="fin-card">
              <div className="card-header-icon blue">
                <CreditCard size={18} /> <h3>Loan Details</h3>
              </div>
              <div className="kv-list">
                <div className="kv-row"><span>Loan Type</span><strong>{loanType}</strong></div>
                <div className="kv-row"><span>Requested Amount</span><strong>{application.loanAmount || "₹8,50,000"}</strong></div>
                <div className="kv-row"><span>Loan Tenure</span><strong>{application.loanTenure || "10 Years"}</strong></div>
                <div className="kv-row"><span>Interest Rate</span><strong>{application.interestRate || "9.25"}% p.a.</strong></div>
                <div className="kv-row"><span>EMI (Estimated)</span><strong>₹{requestedEmi.toLocaleString("en-IN")}</strong></div>
                <div className="kv-row"><span>Purpose of Loan</span><strong>Personal / Asset Finance</strong></div>
              </div>
            </div>

            <div className="fin-card">
              <div className="card-header-icon green">
                <DollarSign size={18} /> <h3>Financial Details</h3>
              </div>
              <div className="kv-list">
                <div className="kv-row"><span>Monthly Income</span><strong>₹{monthlyIncome.toLocaleString("en-IN")}</strong></div>
                <div className="kv-row"><span>Existing EMI</span><strong>₹{existingEmi.toLocaleString("en-IN")}</strong></div>
                <div className="kv-row"><span>Total Monthly Obligations</span><strong>₹{totalObligations.toLocaleString("en-IN")}</strong></div>
                <div className="kv-row"><span>FOIR (Fixed Obligation to Income)</span><strong>{foir}%</strong></div>
                <div className="kv-row"><span>Savings per Month</span><strong>₹{(monthlyIncome - totalObligations).toLocaleString("en-IN")}</strong></div>
                <div className="kv-row"><span>Bank Account Type</span><strong>Salary Account</strong></div>
              </div>
            </div>
          </div>

          <div className="grid-3col">
            <div className="fin-card">
              <div className="card-header-icon purple">
                <FileText size={18} /> <h3>Documents Submitted</h3>
              </div>
              <div className="doc-list">
                {["Identity Proof", "PAN Card", "Salary Slips (3 Months)", "Bank Statements (6 Months)", "ITR (2 Years)"].map((doc, idx) => (
                  <div key={idx} className="doc-row">
                    <span className="doc-name"><CheckCircle2 size={14} color="#10b981" /> {doc}</span>
                    <span className="verified-badge">Verified</span>
                  </div>
                ))}
              </div>
              <div className="all-verified-footer">
                <CheckCircle2 size={16} color="#10b981" /> All documents verified
              </div>
            </div>

            <div className="fin-card">
              <div className="card-header-icon orange">
                <Briefcase size={18} /> <h3>Employment Details</h3>
              </div>
              <div className="kv-list">
                <div className="kv-row"><span>Employer Name</span><strong>{customer?.employmentDetails?.companyName || "Tech Solutions Pvt. Ltd."}</strong></div>
                <div className="kv-row"><span>Designation</span><strong>Senior Software Engineer</strong></div>
                <div className="kv-row"><span>Employment Since</span><strong>May 2021 (3 Years 3 Months)</strong></div>
                <div className="kv-row"><span>Work Experience</span><strong>5 Years 8 Months</strong></div>
                <div className="kv-row"><span>Employment Type</span><strong>Salaried</strong></div>
                <div className="kv-row"><span>Net Monthly Income</span><strong>₹{monthlyIncome.toLocaleString("en-IN")}</strong></div>
              </div>
            </div>

            <div className="fin-card">
              <div className="card-header-icon blue-dark">
                <Building size={18} /> <h3>Existing Loan Details</h3>
              </div>
              <span className="active-loan-subtitle">1 Active Loan</span>
              <div className="existing-loan-box">
                <div className="loan-type-bar">
                  <strong>Personal Loan</strong>
                  <span className="tag-active">Active</span>
                </div>
                <div className="kv-row"><span>Outstanding Amount</span><strong>₹1,20,000</strong></div>
                <div className="kv-row"><span>EMI</span><strong>₹8,000</strong></div>
                <div className="kv-row"><span>Account Number</span><strong>XXXXXXXX1234</strong></div>
                <div className="kv-row"><span>Lender</span><strong>State Bank of India</strong></div>
                <a href="#history" className="history-link">View Repayment History &gt;</a>
              </div>
            </div>
          </div>

          <div className="fin-card remarks-section">
            <div className="card-header-icon dark">
              <FileText size={18} /> <h3>Reviewer Remarks</h3>
            </div>
            <textarea
              maxLength={500}
              placeholder="Add your comments or remarks about this application..."
              value={reviewerRemarks}
              onChange={(e) => setReviewerRemarks(e.target.value)}
            />
            <div className="char-count">{reviewerRemarks.length}/500 characters</div>
          </div>

          <div className="fin-card decision-section">
            <div className="card-header-icon dark">
              <ShieldCheck size={18} /> <h3>Approval Decision</h3>
            </div>
            <div className="action-cards-grid">
              <div className="action-card reject" onClick={() => setActiveModal("reject")}>
                <div className="btn-icon"><XCircle size={18} /></div>
                <div>
                  <strong>Reject Loan</strong>
                  <p>Decline this application</p>
                </div>
              </div>

              <div className="action-card sendback" onClick={() => setActiveModal("sendback")}>
                <div className="btn-icon"><RotateCcw size={18} /></div>
                <div>
                  <strong>Send Back</strong>
                  <p>Request more information</p>
                </div>
              </div>

              <div className="action-card approve" onClick={() => setActiveModal("approve")}>
                <div className="btn-icon"><CheckCircle2 size={18} /></div>
                <div>
                  <strong>Approve Loan</strong>
                  <p>Approve this application</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-sidebar">
          <div className="fin-card risk-card">
            <h3>Credit & Risk Assessment</h3>

            {/* SPEEDOMETER RECHARTS INTEGRATION */}
            <div style={{ position: "relative", width: "100%", height: "150px" }}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={gaugeChartData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {gaugeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {renderNeedle(150, 120, 65, 27)}
                </PieChart>
              </ResponsiveContainer>

              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "26px", fontWeight: "700", color: "#0F172A", display: "block", lineHeight: "1" }}>
                  {creditScore}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B", marginTop: "4px", display: "block" }}>
                  {creditScore >= 750 ? "Good" : creditScore >= 650 ? "Fair" : "Poor"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 28px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94A3B8",
                  marginTop: "-12px",
                }}
              >
                <span>300</span>
                <span>900</span>
              </div>
            </div>

            <div className="risk-metrics-list" style={{ marginTop: "20px" }}>
              <div className="metric-item">
                <span>Risk Level</span>
                <span className={creditScore >= 700 ? "risk-pill-green" : "risk-pill-red"}>
                  {creditScore >= 700 ? "Low Risk" : "High Risk"}
                </span>
              </div>
              <div className="metric-item">
                <span>Probability of Default</span>
                <strong>2.35%</strong>
              </div>
              <div className="metric-item">
                <span>Debt to Income Ratio</span>
                <strong>{foir}%</strong>
              </div>
              <div className="metric-item">
                <span>Credit Utilization</span>
                <strong>28%</strong>
              </div>
              <div className="metric-item">
                <span>Repayment Capacity</span>
                <strong>Strong</strong>
              </div>
            </div>

            <div className="eligibility-banner">
              <ShieldCheck size={20} color="#10B981" />
              <div>
                <strong>Eligible for loan</strong>
                <p>Based on our assessment, this application is eligible for approval.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {activeModal === "approve" && (
              <>
                <h2>Approve Loan Application</h2>
                <p>Are you sure you want to approve Application <strong>{application.id}</strong>?</p>
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="btn-confirm-approve" onClick={() => handleDecisionSubmit("Approved")}>Confirm Approve</button>
                </div>
              </>
            )}

            {(activeModal === "reject" || activeModal === "sendback") && (
              <>
                <h2>{activeModal === "reject" ? "Reject Application" : "Send Back Application"}</h2>
                <p>Please specify a reason for this action:</p>
                <textarea
                  placeholder="Enter detailed reason..."
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                />
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button
                    className={activeModal === "reject" ? "btn-confirm-reject" : "btn-confirm-sendback"}
                    onClick={() => handleDecisionSubmit(activeModal === "reject" ? "Rejected" : "Need More Information")}
                  >
                    Submit Decision 
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApprovalReview;