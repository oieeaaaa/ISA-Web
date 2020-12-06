import dateFormat from 'js/utils/dateFormat';

export const variantAttributes = {
  id: true,
  dateCreated: true,
  name: true,
  size: true,
  brand: true,
  supplier: true
};

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Current Qty.',
    accessKey: 'inventory.quantity'
  },
  {
    label: 'Particular',
    accessKey: 'inventory.particular'
  },
  {
    label: 'Parts No.',
    accessKey: 'inventory.partsNumber'
  },
  {
    label: 'Variant Name',
    accessKey: 'name'
  },
  {
    label: 'Supplier',
    accessKey: 'supplier.initials'
  },
  {
    label: 'Size',
    accessKey: 'size.name'
  },
  {
    label: 'Brand',
    accessKey: 'brand.name'
  }
];

export const tableFilters = {
  inventory: {},
  size: {},
  brand: {},
  supplier: {}
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
  },
  {
    name: 'Name',
    key: 'name'
  }
];
