import cookie from 'cookie';
import safety from './safety';

const parseCookies = (req) => {
  return cookie.parse(safety(req, 'headers.cookie', ''));
};

export default parseCookies;
