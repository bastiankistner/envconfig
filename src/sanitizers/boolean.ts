const TRUE_TEST = /true/i;
const FALSE_TEST = /false/i;

export default (value: any): boolean => {
  if (typeof value === 'string') {
    if (TRUE_TEST.test(value)) {
      return true;
    }

    if (FALSE_TEST.test(value)) {
      return false;
    }
  }

  return Boolean(value);
};
