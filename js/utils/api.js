import responses from './responses';
import isJson from './isJson';

/**
 * api.
 *
 * @param {object} methods: GET | POST | PUT | DELETE
   * Example:
   ```
    const myGetMethod = (req, res) => ...some codes here
    const myPostMethod = (req, res) => ...some codes here

    // use it like this
    const myApi = api({
      get: myGetMethod,
      post: myPostMethod
    });
   ```
 */
const api = (methods) => async (req, res) => {
  const response = responses(res);

  // parse query types to its corresponding value
  if (req.query) {
    req.query = Object.keys(req.query).reduce((values, currentKey) => {
      const currentValue = values[currentKey];

      // parsing part.
      if (isJson(currentValue)) {
        values[currentKey] = JSON.parse(currentValue);
      }

      return values;
    }, req.query);
  }

  for (const method of Object.keys(methods)) {
    const matchedRequest = req.method === method.toUpperCase();

    if (matchedRequest) {
      await methods[method](req, response);
      return;
    }
  }

  throw new Error('Invalid method name: Try using 👉 get, post, put, or delete.');
};

export default api;
