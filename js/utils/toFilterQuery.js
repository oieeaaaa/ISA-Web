/**
 * toFilterQuery.
 *
 * @param {object} filters
 * Sample usage:
 ```
  toFilterQuery({ name: 'bok', age: 20 });

  // expected output:
  // [
  //   {
          name: {
            equals: 'bok'
          },
  //   },
  //   {
          age: {
            equals: 23
          },
  //   },
  // ]
 ```
 */
const toFilterQuery = (filters = {}) => Object.entries(filters).map(([key, value]) => ({
  [key]: {
    equals: value,
  },
}));

export default toFilterQuery;
