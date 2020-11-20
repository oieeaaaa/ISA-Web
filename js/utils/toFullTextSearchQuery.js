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
  keys.map((key) => ({
    [key]: {
      contains: searchVal
    }
  }));

export default toFullTextSearchQuery;
