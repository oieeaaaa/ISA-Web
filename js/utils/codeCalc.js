/**
 * codeCalc.
 *
 * @param {array} codes
 * @param {string} codeStr
 *
 * Sample usage:
 ```
const codes = [
  {
    name: 'V',
    value: 5,
  },
  {
    name: 'I',
    value: 1,
  },
];

const myCode = 'VIAA'; // AA should be zero

// use it like so...
console.log(codeCalc(codes, myCode));

// result: '5100'
 ```
 */
const codeCalc = (codes = [], codeStr = '') =>
  Number(
    codeStr
      .toUpperCase()
      .split('')
      .map((codeName) => {
        const code = codes.find((code) => code.name === codeName);

        if (code) return code.value;

        return 0;
      })
      .join('')
  );

export default codeCalc;
