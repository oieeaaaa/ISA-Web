import dateFormat from 'js/utils/dateFormat';

export const inventoryAttributes = {
  id: true,
  dateCreated: true,
  partsNumber: true,
  particular: true,
  quantity: true,
  description: true,
  uom: true,
  applications: true,
  sizes: true,
  brands: true,
  suppliers: true
};

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Quantity',
    accessKey: 'quantity'
  },
  {
    label: 'Particular',
    accessKey: 'particular'
  },
  {
    label: 'Parts No.',
    accessKey: 'partsNumber'
  },
  {
    label: 'Unit of Measurement',
    accessKey: 'uom.name'
  },
  {
    label: 'Number of Applications',
    accessKey: 'applications',
    customCell: ({ value }) => value.length
  },
  {
    label: 'Number of Sizes',
    accessKey: 'sizes',
    customCell: ({ value }) => value.length
  },
  {
    label: 'Number of Brands',
    accessKey: 'brands',
    customCell: ({ value }) => value.length
  },
  {
    label: 'Number of Suppliers',
    accessKey: 'suppliers',
    customCell: ({ value }) => value.length
  }
];

export const tableFilters = {
  dateReceived: null,
  referenceDate: null,
  brand: {},
  supplier: {}
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
  },
  {
    name: 'Quantity',
    key: 'quantity'
  },
  {
    name: 'Particular',
    key: 'particular'
  },
  {
    name: 'Parts No.',
    key: 'partsNumber'
  }
];

export const initialValues = {
  particular: '',
  partsNumber: '',
  quantity: 0,
  description: '',
  uom: { name: '' },
  applications: [],

  // for Variant
  variants: []
};

export default {
  inventoryAttributes,
  initialValues,
  tableHeaders,
  tableSortOptions,
  tableFilters
};
