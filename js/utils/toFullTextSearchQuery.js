import set from 'lodash.set';

/**
 * toFullTextSearchQuery.
 *
 * @param {object} keys
 * @param {string} searchVal
 *
 * Sample usage:
 ```
  toFullTextSearchQuery(['particular', 'referenceNumber'], 'asd');
 ```
 Result:
 ```
  [
    {
      particular: {
        contains: 'asd',
      },
    },
    {
      referenceNumber: {
        contains: 'asd',
      },
    },
  ]
 ```
 */
const toFullTextSearchQuery = (keys, searchVal) =>
  keys.map((key) =>
    set({}, key, {
      contains: searchVal
    })
  );

export default toFullTextSearchQuery;
