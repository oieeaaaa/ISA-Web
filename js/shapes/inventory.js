import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';

export const tableHeaders = [
  {
    label: 'Reference No.',
    accessKey: 'referenceNumber'
  },
  {
    label: 'Particular',
    accessKey: 'particular'
  },
  {
    label: 'Codes',
    accessKey: 'codes'
  },
  {
    label: 'Brand',
    accessKey: 'brand.name'
  },
  {
    label: 'Supplier',
    accessKey: 'supplier.name'
  },
  {
    label: 'Applications',
    accessKey: 'applications',
    customCell: ({ value }) => { // eslint-disable-line
      const applicationNames = value.map((val) => val.name).join(', ');

      return <p>{applicationNames}</p>;
    }
  }
];

export const tableFilters = {
  owner: {},
  brand: {}
};

export const tableSortOptions = [
  {
    key: 'referenceNumber',
    name: 'Reference No.'
  },
  {
    key: 'particular',
    name: 'Particular'
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
