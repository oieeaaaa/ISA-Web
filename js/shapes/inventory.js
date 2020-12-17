import dateFormat from 'js/utils/dateFormat';
import toMoney from 'js/utils/toMoney';

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
    label: 'Variants',
    accessKey: 'variants',
    customCell: ({ value }) =>
      !value.length ? 'N/A' : value.map(({ name }) => name).join(', ')
  }
];

export const tableFilters = {
  dateCreated: null,
  brands: [],
  suppliers: []
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
  variants: [],

  // modal
  variantModal: {
    name: '',
    codes: '',
    srp: 0,
    supplier: { initials: '' },
    size: { name: '' },
    brand: { name: '' },
    unitCost: 0
  }
};

export const variantsHeaders = [
  {
    label: 'Variant Name',
    accessKey: 'name'
  },
  {
    label: 'Codes',
    accessKey: 'codes'
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
    label: 'Size',
    accessKey: 'size.name'
  },
  {
    label: 'Brand',
    accessKey: 'brand.name'
  },
  {
    label: 'Supplier',
    accessKey: 'supplier.vendor'
  }
];
