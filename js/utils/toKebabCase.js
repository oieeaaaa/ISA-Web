const toKebabCase = (text, delimiter = ' ') =>
  text.split(delimiter).join('-').toLowerCase();

export default toKebabCase;
