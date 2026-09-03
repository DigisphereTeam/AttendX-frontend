
export const formatToUTCDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
};

export const formatToUTCTime = (timeStr) => {
  if (!timeStr) return "--";
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return "--";

  let hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Formats 0 as 12
  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes} ${ampm}`;
};

// export const calculateHoursWorked = (startStr, endStr) => {
//   if (!startStr || !endStr) return "--";
//   const diffMs = new Date(endStr) - new Date(startStr);
//   return diffMs > 0 ? (diffMs / (1000 * 60 * 60)).toFixed(1) : "--";
// };
