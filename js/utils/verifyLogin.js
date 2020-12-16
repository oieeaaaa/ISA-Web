import { AUTH_KEY } from 'js/shapes/cookies';
import parseCookies from './parseCookies';
import safety from './safety';

const verifyLogin = (req, res) => {
  const data = parseCookies(req);

  if (!safety(data, AUTH_KEY, '')) {
    res.writeHead(301, { Location: '/login' });
    res.end();

    return false;
  }

  return true;
};

export default verifyLogin;
