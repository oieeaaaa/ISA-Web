const toPascalCase = (text, delimiter = '-') => text
  .split(delimiter)
  .map((name) => name[0].toUpperCase() + name.substr(1))
  .join('');

export default toPascalCase;
