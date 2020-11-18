/*
 * Safety
 * It will make you feel safe.
 *
 * Sample usage:
    safety({ profile: { image: 'yo' } }, 'profile.image', '');
*/
const safety = (obj = {}, accessKey, defaultValue = null) => {
  const keys = accessKey.split('.');
  let currentValue = null;

  // iterate to obj
  for (const key of keys) { // eslint-disable-line
    currentValue = !currentValue ? obj[key] : currentValue[key];

    // do not proceed if the property doesn't have a value
    if (!currentValue) {
      return defaultValue;
    }
  }

  return currentValue;
};

export default safety;
