import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';
import { safeType } from 'js/utils/safety';
import dateFormat from 'js/utils/dateFormat';

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => dateFormat(value)
  },
  {
    label: 'Type',
    accessKey: 'type.name'
  },
  {
    label: 'Customer',
    accessKey: 'name'
  },
  {
    label: 'Tin',
    accessKey: 'tin'
  },
  {
    label: 'SI Number',
    accessKey: 'siNumber'
  },
  {
    label: 'ARS Number',
    accessKey: 'arsNumber'
  },
  {
    label: 'DR Number',
    accessKey: 'drNumber'
  },
  {
    label: 'CRS Number',
    accessKey: 'crsNumber'
  },
  {
    label: 'Address',
    accessKey: 'address'
  },
  {
    label: 'Payment Type',
    accessKey: 'paymentType.name'
  },
  {
    label: 'Cheque Number',
    accessKey: 'chequeNumber'
  },
  {
    label: 'Cheque Date',
    accessKey: 'chequeDate',
    customCell: ({ value }) => dateFormat(value)
  },
  {
    label: 'Discount',
    accessKey: 'discount'
  },
  {
    label: 'Bank',
    accessKey: 'bank.name'
  },
  {
    label: 'Sales Staff',
    accessKey: 'salesStaff',
    customCell: ({ value }) => value.map((val) => val.name).join(', ')
  },
  {
    label: 'Total Sold Items',
    accessKey: 'soldItems',
    customCell: ({ value }) =>
      value.reduce((total, cur) => (total += safeType.number(cur.quantity)), 0)
  }
];

export const tableFilters = {
  dateCreated: null,
  type: {},
  salesStaff: []
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
  },
  {
    name: 'Type',
    key: 'type.name'
  },
  {
    name: 'Customer',
    key: 'name'
  },
  {
    name: 'Tin',
    key: 'tin'
  },
  {
    name: 'SI Number',
    key: 'siNumber'
  },
  {
    name: 'ARS Number',
    key: 'arsNumber'
  },
  {
    name: 'DR Number',
    key: 'drNumber'
  },
  {
    name: 'CRS Number',
    key: 'crsNumber'
  },
  {
    name: 'Address',
    key: 'address'
  },
  {
    name: 'Payment Type',
    key: 'paymentType.name'
  },
  {
    name: 'Cheque Number',
    key: 'chequeNumber'
  },
  {
    name: 'Cheque Date',
    key: 'chequeDate'
  },
  {
    name: 'Discount',
    key: 'discount'
  },
  {
    name: 'Bank',
    key: 'bank.name'
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

export const submitPayload = ({
  applications,
  uom,
  brand,
  supplier,
  ...payload
}) => ({
  ...payload,
  applications: connectOrCreateMultiple(applications),
  brand: connectOrCreateSingle(brand),
  uom: connectOrCreateSingle(uom),
  supplier: {
    connect: {
      id: supplier.id
    }
  }
});

export default {
  initialValues,
  submitPayload,
  tableHeaders,
  tableSortOptions,
  tableFilters
};
