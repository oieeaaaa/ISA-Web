/**
 * dateFormat.
 *
 * @param {string} value
 * @param {object} options
 */
const dateFormat = (value, options = {}) => {
  const intlDateTimeFormat = new Intl.DateTimeFormat('en-US', options);

  return intlDateTimeFormat.format(new Date(value));
};

export default dateFormat;
