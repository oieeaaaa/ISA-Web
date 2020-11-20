export const defaultLimits = [
  {
    name: 'Five',
    value: 5,
  },
  {
    name: 'Ten',
    value: 10,
  },
  {
    name: 'Twenty',
    value: 20,
  },
];

export const defaultConfigs = ({
  sortBy: {},
  direction: 'desc', // asc | desc
  search: '',
  limit: defaultLimits[0],
  page: 1,
});

export default defaultConfigs;
