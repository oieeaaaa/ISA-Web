/**
 * cssClassModifier.
 * TODO: Apply this to all className that has a conditional modifier
 *
 * @param {string} main
 * @param {array} modifiers
 * @param {array} dependencies
 */
const cssClassModifier = (main = '', modifiers = [], dependencies = []) => {
  let newClass = main;
  let newModifiers = modifiers
    .filter((_, index) => !!dependencies[index]) // filter modifier if the dependency is falsy
    .map((modifier) => `${main}--${modifier}`); // form a BEM modifier

  if (newModifiers.length) {
    newClass += ` ${newModifiers.join(' ')}`;
  }

  return newClass;
};

export default cssClassModifier;
