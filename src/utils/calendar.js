const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatMonthYear = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

export const getCalendarGrid = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const cells = [];

  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    cells.push({
      date,
      day: date.getDate(),
      dateKey: formatDateKey(date),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      date,
      day,
      dateKey: formatDateKey(date),
      isCurrentMonth: true,
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const trailingCount = 7 - remainder;
    for (let day = 1; day <= trailingCount; day += 1) {
      const date = new Date(year, month + 1, day);
      cells.push({
        date,
        day,
        dateKey: formatDateKey(date),
        isCurrentMonth: false,
      });
    }
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
};

export const getWeekdayLabels = () => WEEKDAY_LABELS;