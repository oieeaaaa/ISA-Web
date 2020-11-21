/**
 * dateFormat.
 *
 * @param {string} value
 * @param {object} options
 */
const dateFormat = (value, options) => {
  const intlDateTimeFormat = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    ...options
  });

  return intlDateTimeFormat.format(new Date(value));
};

export default dateFormat;
