import omit from 'lodash.omit';
import { safeType } from 'js/utils/safety';
import dateFormat from 'js/utils/dateFormat';
import codeCalc from 'js/utils/codeCalc';

export const tableHeaders = (codes) => [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Supplier',
    accessKey: 'supplier.vendor'
  },
  {
    label: 'Quantity',
    accessKey: 'items',
    customCell: ({ value }) =>
      value.reduce((total, cur) => (total += cur.quantity), 0)
  },
  {
    label: 'Grand Total',
    accessKey: 'items',
    customCell: ({ value }) =>
      `Php ${value.reduce(
        (total, cur) =>
          (total += codeCalc(codes, cur.item.codes) * cur.quantity),
        0
      )}`
  }
];

export const tableFilters = {
  dateCreated: null,
  supplier: {}
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
  }
];

export const initialValues = {
  dateCreated: new Date(),
  supplier: {},
  items: [],

  // Modal related stuff
  // NOTE: Properties below should not be submitted as a payload
  modal: {
    mode: 'add',
    selectedItem: { particular: '' },
    selectedQuantity: 0
  }
};

export const submitPayload = (payload) => omit(payload, ['modal']);

export const itemsHeaders = (codes) => [
  {
    label: 'Quantity',
    accessKey: 'selectedQuantity'
  },
  {
    label: 'Unit of Measurement',
    accessKey: 'uom.name'
  },
  {
    label: 'Particular',
    accessKey: 'particular'
  },
  {
    label: 'Parts Number',
    accessKey: 'partsNumber'
  },
  {
    label: 'Applications',
    accessKey: 'applications',
    customCell: ({ value }) =>
      safeType
        .array(value)
        .map((val) => val.name)
        .join(', ')
  },
  {
    label: 'Description',
    accessKey: 'description'
  },
  {
    label: 'Size',
    accessKey: 'size'
  },
  {
    label: 'Codes',
    accessKey: 'codes'
  },
  {
    label: 'Unit Cost',
    accessKey: 'codes',
    customCell: ({ value }) => `₱ ${codeCalc(codes, value)}`
  },
  {
    label: 'Remarks',
    accessKey: 'remarks'
  }
];

export const itemsSortOptions = [
  {
    name: 'Quantity',
    key: 'quantity'
  },
  {
    name: 'Unit of Measurement',
    key: 'uom.name'
  },
  {
    name: 'Particular',
    key: 'particular'
  },
  {
    name: 'Parts Number',
    key: 'partsNumber'
  },
  {
    name: 'Applications',
    key: 'applications'
  },
  {
    name: 'Description',
    key: 'description'
  },
  {
    name: 'Size',
    key: 'size'
  },
  {
    name: 'Codes',
    key: 'codes'
  },
  {
    name: 'Remarks',
    key: 'remarks'
  }
];

export const toItems = (items) =>
  items.map((item) => ({
    selectedQuantity: item.quantity,
    ...item.item
  }));

export default {
  initialValues,
  submitPayload,
  tableHeaders,
  tableSortOptions,
  tableFilters,
  itemsHeaders,
  itemsSortOptions,
  toItems
};
