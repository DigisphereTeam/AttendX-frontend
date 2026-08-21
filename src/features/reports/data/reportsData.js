export const reportStats = [
  { value: "1,240", label: "Present" },
  { value: "45", label: "Absent" },
  { value: "82", label: "Late" },
  { value: "9,840.5", label: "Total Working Hours" },
];

export const reportsPieData = {
  labels: ["Present", "Late", "Absent"],
  datasets: [
    {
      data: [1240, 82, 45],
      backgroundColor: ["#12B76A", "#F79009", "#F04438"],
      borderColor: ["#ffffff", "#ffffff", "#ffffff"],
      borderWidth: 2,
    },
  ],
};

export const reportTableData = [
  {
    id: 1,
    name: "Rahul Sharma",
    initials: "RS",
    dept: "Engineering",
    present: 21,
    late: 1,
    absent: 0,
    hrs: "168.0",
  },
  {
    id: 2,
    name: "Ananya Gupta",
    initials: "AG",
    dept: "Human Resources",
    present: 20,
    late: 2,
    absent: 0,
    hrs: "160.0",
  },
  {
    id: 3,
    name: "Priya Menon",
    initials: "PM",
    dept: "Sales & Marketing",
    present: 19,
    late: 0,
    absent: 2,
    hrs: "152.5",
  },
  {
    id: 4,
    name: "Siddharth Verma",
    initials: "SV",
    dept: "Engineering",
    present: 22,
    late: 0,
    absent: 0,
    hrs: "176.0",
  },
];