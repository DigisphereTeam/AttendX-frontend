export const statsData = [
  { title: "Total Employees", value: "12", bg: "#0F3460", icon: "people" },
  { title: "Present Today", value: "2", bg: "#12B76A", icon: "check" },
  { title: "Absent Today", value: "10", bg: "#F04438", icon: "cross" },
  { title: "Late Arrivals", value: "2", bg: "#F79009", icon: "alarm" },
];

export const weeklyTrendData = {
  labels: ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
  datasets: [
    { label: "Present", data: [11, 8, 0, 0, 8, 11, 0], backgroundColor: "#12B76A", borderRadius: 4 },
    { label: "Late", data: [0, 2, 0, 0, 3, 0, 2], backgroundColor: "#F79009", borderRadius: 4 },
    { label: "Absent", data: [0, 1, 11, 11, 0, 0, 9], backgroundColor: "#F04438", borderRadius: 4 },
  ],
};

export const deptStrengthData = {
  labels: ["Engineering", "Human Resources", "Sales & Marketing", "Finance", "Operations"],
  datasets: [
    {
      data: [4, 2, 2, 2, 2],
      backgroundColor: ["#0F3460", "#00B4D8", "#12B76A", "#F79009", "#F04438"],
      borderWidth: 0,
    },
  ],
};

export const punchFeed = [
  { id: 1, name: "Karthik Reddy", initials: "KR", dept: "Sales & Marketing", time: "Punched In 11:07 AM", status: "Late" },
  { id: 2, name: "Priya Menon", initials: "PM", dept: "Human Resources", time: "Punched In 11:06 AM", status: "Late" },
];

export const deptList = [
  { name: "Engineering", head: "Arjun Verma", count: "4 emp" },
  { name: "Human Resources", head: "Priya Menon", count: "2 emp" },
  { name: "Sales & Marketing", head: "Karthik Reddy", count: "2 emp" },
  { name: "Finance", head: "Sneha Iyer", count: "2 emp" },
  { name: "Operations", head: "Vikram Singh", count: "2 emp" },
];