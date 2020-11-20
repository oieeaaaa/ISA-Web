/**
 * toParam.
 * From object to query params
 * @param {object} param
 *
 * Sample usage:
 ```
  const myParam = {
    search: 'amazinggg',
    limit: 5,
    page: 2
  };

  // convert to query params
  toParam(myParam); // that's it.

  // output: search="amazinggg"&limit=5&page=2
 ```
 */
const toParam = (param = {}) =>
  Object.entries(param) // split key/value and store it to array
    .filter(([value]) => !!value) // omit falsy values
    .map(([key, value]) => `${key}=${value}`)
    .join('&'); // actual param

export default toParam;
