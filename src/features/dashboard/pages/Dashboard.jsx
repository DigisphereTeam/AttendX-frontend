import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaFingerprint } from "react-icons/fa";

import {
  statsData,
  weeklyTrendData,
  deptStrengthData,
  punchFeed,
  deptList,
} from "../data/mockData";
import "./Dashboard.css";
import StatCard from "../../../components/StatCard/StatCard";
import Avatar from "../../../components/Avatar/Avatar";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// 4th Fix: Exact icon mapping matching image_8c05be
const statIcons = [FaUsers, FaUserCheck, FaUserTimes, FaUserClock];

const Dashboard = () => {
  return (
    <div className="dashboard-view">
      {/* STATS ROW */}
      <div className="stats-grid">
        {statsData.map((item, idx) => {
          const IconComponent = statIcons[idx % statIcons.length];
          return (
            <StatCard
              key={idx}
              title={item.title}
              value={item.value}
              icon={() => (
                <div className="stat-icon-wrapper">
                  <IconComponent className="stat-icon" />
                </div>
              )}
            />
          );
        })}
      </div>

      {/* CHARTS ROW */}
      <div className="charts-grid">
        <div className="card-box">
          <h3 className="card-heading">Weekly Attendance Trend</h3>
          <p className="card-subtext">Present vs Absent vs Late — last 7 days</p>
          <div className="chart-wrapper">
            <Bar
              data={weeklyTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
                scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="card-box">
          <h3 className="card-heading">Department-wise Strength</h3>
          <p className="card-subtext">Employee distribution</p>
          
          {/* 3rd Fix: Wrapper centered flex layout */}
          <div className="doughnut-wrapper">
            <Doughnut
              data={deptStrengthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          
          <div className="dept-legend">
            {deptStrengthData.labels.map((lbl, idx) => (
              <div className="legend-item" key={idx}>
                <span>
                  <span
                    className="dot"
                    style={{ backgroundColor: deptStrengthData.datasets[0].backgroundColor[idx] }}
                  ></span>
                  {lbl}
                </span>
                <strong>{deptStrengthData.datasets[0].data[idx]}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM PANELS ROW */}
      <div className="panels-grid">
        <div className="card-box">
          <div className="panel-header">
            <h3 className="card-heading">Today's Punch Activity</h3>
            <span className="live-badge">
              <FaFingerprint /> Live Feed
            </span>
          </div>
          <div className="punch-feed">
            {punchFeed.map((item) => (
              <div key={item.id} className="punch-item">
                {/* 1st Fix: Avatar alongside aligned info wrapper */}
                <Avatar name={item.name} src={item.avatarSrc} size="small" />
                <div className="punch-info">
                  <strong>{item.name}</strong>
                  <p>{item.dept} • {item.time}</p>
                </div>
                <span className="badge-late">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-box">
          <h3 className="card-heading">Departments Overview</h3>
          <p className="card-subtext">Quick snapshot</p>
          <div className="dept-list">
            {deptList.map((dept, idx) => (
              <div key={idx} className="dept-item">
                <div>
                  <strong>{dept.name}</strong>
                  <p>Head: {dept.head}</p>
                </div>
                <span className="dept-chip">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;