import { safeType } from 'js/utils/safety';

const toMoney = (value) =>
  Number(safeType.number(value).toFixed(1)).toLocaleString();

export default toMoney;
