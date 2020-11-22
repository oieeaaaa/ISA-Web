import set from 'lodash.set';
import omitBy from 'lodash.omitby'; // eslint-disable-line

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
const toFilterQuery = (filters = {}) =>
  Object.entries(filters).map(([key, value]) => {
    let newValue = set({}, key, {
      equals: value
    });

    if (key.includes('_range')) {
      const values = value.split(',');

      newValue = set(
        {},
        key.replace('_range', ''),
        omitBy(
          {
            gte: values[0],
            lte: values[1]
          },
          (val) => !val
        )
      );
    }

    return newValue;
  });

export default toFilterQuery;
