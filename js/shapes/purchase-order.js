import omit from 'lodash.omit';
import { safeType } from 'js/utils/safety';
import dateFormat from 'js/utils/dateFormat';

export const tableHeaders = [
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
    accessKey: 'item',
    customCell: () => 10 // TODO: Update this later, TALLY THE QUANTITY
  },
  {
    label: 'Grand Total',
    accessKey: 'item',
    customCell: () => 'Php 10,538' // TODO: Update this later, TALLY THE Grand Total
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
  removedItems: [],

  // Modal related stuff
  // NOTE: Properties below should not be submitted as a payload
  modal: {
    mode: 'add',
    selectedItem: { particular: '' },
    selectedQuantity: 0
  }
};

export const submitPayload = (payload) =>
  omit(payload, ['modal', 'removedItems']);

export const itemsHeaders = [
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

export default {
  initialValues,
  submitPayload,
  tableHeaders,
  tableSortOptions,
  tableFilters,
  itemsHeaders,
  itemsSortOptions
};
