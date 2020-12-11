import dateFormat from 'js/utils/dateFormat';
import toMoney from 'js/utils/toMoney';

export const variantAttributes = {
  id: true,
  dateCreated: true,
  name: true,
  codes: true,
  srp: true,
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
    label: 'Variant Name',
    accessKey: 'name'
  },
  {
    label: 'Unit Cost',
    accessKey: 'unitCost',
    customCell: ({ value }) => `Php ${toMoney(value)}`
  },
  {
    label: 'SRP',
    accessKey: 'srp',
    customCell: ({ value }) => `Php ${toMoney(value)}`
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
    name: 'Variant Name',
    key: 'name'
  }
];
