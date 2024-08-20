export const formatSpeed = (speed) => {
  if (!String(speed)) {
    throw new Error('Speed is not defined');
  }

  return `${Math.round(speed * 3.6)}km/h`;
};
