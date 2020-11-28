import isJson from 'js/utils/isJson';
import isObjectEmpty from 'js/utils/isObjectEmpty';

/*
 * Safety
 * It will make you feel safe.
 *
 * Sample usage:
    safety({ profile: { image: 'yo' } }, 'profile.image', '');
*/
const safety = (obj = {}, mainKey, defaultValue = null) => {
  if (!obj) return defaultValue;

  const keys = mainKey.split('.');
  let currentValue = null;

  // iterate to obj
  for (const key of keys) {
    // eslint-disable-line
    currentValue = !currentValue ? obj[key] : currentValue[key];

    // do not proceed if the property doesn't have a value
    if (!currentValue) {
      return defaultValue;
    }
  }

  return currentValue;
};

export const safeType = {
  string: (val) => (typeof val === 'string' && val ? val : ''),
  number: (val) => val || 0,
  boolean: (val) => val || false,
  object: (val) => (isObjectEmpty(val) ? {} : val),
  array: (val) => val || [],
  function: (val) => val || (() => {}),
  json: (val) => (isJson(val) ? JSON.parse(val) : val),
  date: (val) => (val ? new Date(val) : null)
};

export default safety;
