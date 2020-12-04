export const defaultLimits = [
  {
    name: 'Five',
    value: 5
  },
  {
    name: 'Twenty',
    value: 20
  },
  {
    name: 'Thirty',
    value: 30
  },
  {
    name: 'Fifty',
    value: 50
  },
  {
    name: 'Hundred',
    value: 100
  }
];

export const defaultConfigs = {
  sortBy: {
    key: 'dateCreated'
  },
  direction: 'desc', // asc | desc
  search: '',
  limit: defaultLimits[0],
  page: 1
};

export default defaultConfigs;
