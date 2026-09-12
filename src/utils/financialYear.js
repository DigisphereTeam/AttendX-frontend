
export const getCurrentFinancialYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const isBeforeApril = now.getMonth() < 3;

  const startYear = isBeforeApril ? year - 1 : year;
  return `${startYear}-${startYear + 1}`;
};

export const generateFinancialYears = (count = 5) => {
  const [currentStartYear] = getCurrentFinancialYear().split("-").map(Number);

  return Array.from({ length: count }, (_, i) => {
    const startYear = currentStartYear - i;
    const endYear = startYear + 1;

    return {
      label: `FY ${startYear}–${String(endYear).slice(-2)}`,
      value: `${startYear}-${endYear}`,
    };
  });
};

export const getFinancialYearRange = (financialYear) => {
  if (!financialYear) return null;

  const [startYear, endYear] = financialYear.split("-").map(Number);

  return {
    start: `${startYear}-04-01`,
    end: `${endYear}-03-31`,
  };
};