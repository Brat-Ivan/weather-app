export const formatLocationName = (data) => {
  return data
    .trim()
    .split(/\s+/)
    .map(elem => {
      return elem
        .split('-')
        .map(elem => {
          return elem[0].toUpperCase() + elem.slice(1).toLocaleLowerCase();
        })
        .join('-');
    })
    .join(' ');
};
