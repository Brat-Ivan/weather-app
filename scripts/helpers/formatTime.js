export const formatTime = (time) => {
  if (!time) {
    throw new Error('Time is not defined');
  }

  return `${time}:00`;
};
