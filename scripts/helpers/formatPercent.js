export const formatPercent = (percent) => {
  if (!String(percent)) {
    throw new Error('Percent is not defined');
  }

  return `${percent}%`;
};
