import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const AnalyticsCharts = ({ data }) => {
  // Chart 1 Data: Status Distribution
  const approvedCount = data.filter(d => d.status === 'Approved').length;
  const pendingCount = data.filter(d => d.status === 'Pending').length;
  const rejectedCount = data.filter(d => d.status === 'Rejected').length;

  const statusData = [
    { name: 'Approved', value: approvedCount, color: '#22c55e' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Chart 2 Data: Loan Type Distribution
  const loanTypeCounts = data.reduce((acc, item) => {
    const type = item.loanType || 'Personal Loan';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const typeColors = ['#0284c7', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
  const loanTypeData = Object.keys(loanTypeCounts).map((key, index) => ({
    name: key,
    value: loanTypeCounts[key],
    color: typeColors[index % typeColors.length],
  }));

  // Dummy Trend & EMI Collection Data for Visuals
  const trendData = [
    { month: 'Mar', Applications: 45 },
    { month: 'Apr', Applications: 52 },
    { month: 'May', Applications: 65 },
    { month: 'Jun', Applications: 70 },
    { month: 'Jul', Applications: 60 },
    { month: 'Aug', Applications: Math.max(data.length, 75) },
  ];

  const emiData = [
    { category: 'Paid', amount: 80.5 },
    { category: 'Pending', amount: 35.2 },
    { category: 'Overdue', amount: 12.8 },
  ];

  return (
    <div className="charts-grid">
      {/* Chart 1: Trend Line */}
      <div className="chart-card">
        <h4>Applications Trend</h4>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={trendData}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="Applications" stroke="#2563eb" fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Approval Status Donut */}
      <div className="chart-card">
        <h4>Approval Status</h4>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusData.length ? statusData : [{ name: 'No Data', value: 1, color: '#cbd5e1' }]}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Loan Type Distribution */}
      <div className="chart-card">
        <h4>Loan Type Distribution</h4>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={loanTypeData.length ? loanTypeData : [{ name: 'No Data', value: 1, color: '#cbd5e1' }]}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {loanTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: EMI Collection */}
      <div className="chart-card">
        <h4>EMI Collection Overview (Lakhs)</h4>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={emiData}>
              <XAxis dataKey="category" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;