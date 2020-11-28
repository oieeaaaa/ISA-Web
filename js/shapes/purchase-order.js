import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';
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
  items: []
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
