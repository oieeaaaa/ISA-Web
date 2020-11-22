import { safeType } from './safety';

/**
 * toStringifyDate.
 *
 * @param {Date} date
 */
const toStringifyDate = (date) =>
  date ? safeType.json(JSON.stringify(date)) : null;

export default toStringifyDate;
