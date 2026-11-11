export const formatCurrency = (amount: number, maximumFractionDigits = 0): string => {
  if (!Number.isFinite(amount)) return '$0';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits,
  }).format(amount);
};

export const formatPercent = (value: number, decimals = 1): string => {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};
