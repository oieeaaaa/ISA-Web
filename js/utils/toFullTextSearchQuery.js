import set from 'lodash.set';
import merge from 'lodash.merge';

/**
 * toFullTextSearchQuery.
 *
 * @param {object} keys
 * @param {string} searchVal
 *
 * Sample usage:
 NORMAL
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

 NESTED
 ```
  toFullTextSearchQuery(['inventory.name', 'referenceNumber'], 'asd');
 ```
 Result:
 ```
  [
    {
      inventory: {
        name: {
          contains: 'asd',
        },
      }
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
  Object.entries(
    merge(
      ...keys.map((key) =>
        set({}, key, {
          contains: searchVal ? String(searchVal) : '',
          mode: 'insensitive'
        })
      )
    )
  ).map(([key, value]) => ({
    [key]: value
  }));

export default toFullTextSearchQuery;
