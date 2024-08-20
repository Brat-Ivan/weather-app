export const formatTemperature = (temperature) => {
  if (!String(temperature)) {
    throw new Error('Temperature is not defined');
  }

  return `${Math.round(temperature)}°`;
};
