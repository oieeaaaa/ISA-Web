import codeCalc from 'js/utils/codeCalc';
import dateFormat from 'js/utils/dateFormat';

export const inventoryAttributes = {
  id: true,
  dateCreated: true,
  partsNumber: true,
  particular: true,
  quantity: true,
  codes: true,
  srp: true,
  description: true,
  uom: true,
  applications: true,
  sizes: true,
  brands: true,
  suppliers: true
};

export const tableHeaders = ({ codes }) => [
  {
    label: 'Date Received',
    accessKey: 'dateReceived',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Reference Date',
    accessKey: 'referenceDate',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Reference No.',
    accessKey: 'referenceNumber'
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
    label: 'Description',
    accessKey: 'description'
  },
  {
    label: 'Applications',
    accessKey: 'applications',
    customCell: ({ value }) => { // eslint-disable-line
      const applicationNames = value.map((val) => val.name).join(', ');

      return <p>{applicationNames}</p>;
    }
  },
  {
    label: 'Brand',
    accessKey: 'brand.name'
  },
  {
    label: 'Size',
    accessKey: 'size'
  },
  {
    label: 'Supplier',
    accessKey: 'supplier.name'
  },
  {
    label: 'Codes',
    accessKey: 'codes'
  },
  {
    label: 'Unit of Measurement',
    accessKey: 'uom.name'
  },
  {
    label: 'Unit Cost',
    accessKey: 'codes',
    customCell: ({ value }) => codeCalc(codes, value)
  },
  {
    label: 'Quantity',
    accessKey: 'quantity'
  },
  {
    label: 'Amount',
    accessKey: 'codes',
    customCell: ({ value }) => codeCalc(codes, value)
  },
  {
    label: 'Suggested Retail Price',
    accessKey: 'srp'
  },
  {
    label: 'Remarks',
    accessKey: 'remarks'
  },
  {
    label: 'Received by',
    accessKey: 'receivedBy'
  },
  {
    label: 'Checked by',
    accessKey: 'checkedBy'
  },
  {
    label: 'Coded by',
    accessKey: 'codedBy'
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
    name: 'Date Received',
    key: 'dateReceived'
  },
  {
    name: 'Reference Date',
    key: 'referenceDate'
  },
  {
    name: 'Reference No.',
    key: 'referenceNumber'
  },
  {
    name: 'Particular',
    key: 'particular'
  },
  {
    name: 'Parts No.',
    key: 'partsNumber'
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
    name: 'Unit of Measurement',
    key: 'uom.name'
  },
  {
    name: 'Quantity',
    key: 'quantity'
  },
  {
    name: 'Suggested Retail Price',
    key: 'srp'
  },
  {
    name: 'Remarks',
    key: 'remarks'
  },
  {
    name: 'Received by',
    key: 'receivedBy'
  },
  {
    name: 'Checked by',
    key: 'checkedBy'
  },
  {
    name: 'Coded by',
    key: 'codedBy'
  }
];

export const initialValues = {
  dateReceived: new Date(),

  // reference
  referenceNumber: '',
  referenceDate: new Date(),

  // details
  particular: '',
  partsNumber: '',
  size: '',
  quantity: 0,
  applications: [],
  brand: {
    name: ''
  },
  supplier: {
    id: '',
    name: ''
  },
  description: '',

  // pricing
  codes: '',
  uom: {
    name: ''
  },
  srp: 0,

  // other info
  remarks: '',
  receivedBy: '',
  checkedBy: '',
  codedBy: ''
};

export default {
  inventoryAttributes,
  initialValues,
  tableHeaders,
  tableSortOptions,
  tableFilters
};
