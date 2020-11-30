/**
 * fetcher.
 * An extended version of fetch
 * Built by yours truly: Joimee T. Cajandab
 *
 * @param {string} route
 * @param {object} options
 */
const fetcher = async (route, options = {}) => {
  const { NEXT_PUBLIC_API_URL } = process.env;
  let url = `/api${route}`;

  if (process.env.NODE_ENV === 'development') {
    url = `${NEXT_PUBLIC_API_URL}${url}`;
  }

  try {
    const rawResult = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });

    const result = await rawResult.json();

    return result;
  } catch (err) {
    return err;
  }
};

export default fetcher;
