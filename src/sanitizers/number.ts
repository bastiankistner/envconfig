export default (value: any): number => {
  if (typeof value === 'number') {
    return value;
  }

  if (`${value}`.includes('.')) {
    return parseFloat(value);
  }

  return parseInt(value, 10);
};
