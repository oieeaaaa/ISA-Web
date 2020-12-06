import dateFormat from 'js/utils/dateFormat';

export const stockInAttributes = {
  id: true,
  dateCreated: true,
  referenceNumber: true,
  referenceDate: true,
  receivedBy: true,
  checkedBy: true,
  codedBy: true,
  remarks: true,
  items: true,
  supplier: true,
  supplierID: true
};

export const initialValues = {
  referenceNumber: '',
  referenceDate: new Date(),
  remarks: '',
  receivedBy: '',
  checkedBy: '',
  codedBy: '',

  supplier: {
    id: '',
    initials: ''
  },
  items: [],

  // don't send this to BE
  addToListModal: {
    data: {},
    quantity: null
  }
};

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => dateFormat(value)
  },
  {
    label: 'Reference Date',
    accessKey: 'referenceDate',
    customCell: ({ value }) => dateFormat(value)
  },
  {
    label: 'Reference No.',
    accessKey: 'referenceNumber'
  },
  {
    label: 'Supplier',
    accessKey: 'supplier.initials'
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
  dateCreated: null,
  referenceDate: null,
  receivedBy: { receivedBy: '' },
  checkedBy: { checkedBy: '' },
  codedBy: { codedBy: '' },
  supplier: { initials: '' }
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
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

export const addedItemsHeaders = [
  {
    label: 'Quantity',
    accessKey: 'inventory.plusQuantity'
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
    label: 'Size',
    accessKey: 'size.name'
  },
  {
    label: 'Brand',
    accessKey: 'brand.name'
  }
];
