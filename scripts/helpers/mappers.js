export function weatherConditionToIconMapper(iconCode) {
  switch(iconCode) {
    case '01d':
      return 'sun';
    case '01n':
      return 'moon';
    case '02d':
      return 'cloud-sun';
    case '02n':
      return 'cloud-moon';
    case '03d':
    case '03n':
      return 'cloudy';
    case '04d':
    case '04n':
      return 'clouds';
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return 'cloud-rain';
    case '11d':
    case '11n':
      return 'cloud-lightning';
    case '13d':
    case '13n':
      return 'snow';
    case '50d':
    case '50n':
      return 'cloud-fog';
  }
}
