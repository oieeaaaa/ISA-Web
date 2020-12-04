import set from 'lodash.set';
import omitBy from 'lodash.omitby'; // eslint-disable-line

/**
 * toFilterQuery.
 *
 * @param {object} filters
 * Sample usage:
 ```
  // Common
  toFilterQuery({ name: 'bok', age: 20 });

  // Multiple
  toFilterQuery({ 'salesStaff_multiple.id': 'bok', age: 20 });

  // Range
  toFilterQuery({ name: 'bok', 'dateCreated_range': 20 });
 ```
 */
const toFilterQuery = (filters = {}) =>
  Object.entries(filters).map(([key, value]) => {
    let newValue = set({}, key, {
      equals: value
    });

    // ADD YOUR CONDITION HERE

    // ADD YOUR CONDITION HERE

    // multiple
    if (key.includes('_multiple')) {
      const values = value.split(',');

      // trim '_multiple' -> split keys
      const keys = key.replace('_multiple', '').split('.');

      // omit last item -> join the keys
      const newKey = keys.slice(0, keys.length - 1).join('.');

      // get the last key
      const lastKey = keys.slice(-1)[0];

      return set(
        {},
        `${newKey}.some.AND`,
        values.map((val) => ({
          // last key should be the identifier for filter
          [lastKey]: {
            equals: val
          }
        }))
      );
    }

    // range
    if (key.includes('_range')) {
      const values = value.split(',');

      return set(
        {},
        key.replace('_range', ''),
        omitBy(
          !values[1] || values[0] === values[1]
            ? {
                gte: values[0]
              }
            : {
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
