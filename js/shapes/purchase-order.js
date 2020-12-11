import omit from 'lodash.omit';
import { initialValues as listModalInitialValues } from 'js/shapes/add-to-list-modal';
import dateFormat from 'js/utils/dateFormat';
import toMoney from 'js/utils/toMoney';

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Supplier',
    accessKey: 'supplier',
    customCell: ({ value }) =>
      value ? `(${value.initials}) ${value.vendor}` : 'N/A'
  },
  {
    label: 'Tracking',
    accessKey: 'tracking.address'
  },
  {
    label: 'Total Quantity',
    accessKey: 'totalQuantity'
  },
  {
    label: 'Total Costs',
    accessKey: 'grandTotal',
    customCell: ({ value }) => `Php ${toMoney(value)}`
  }
];

export const tableFilters = {
  dateCreated: null,
  supplier: { initials: '' },
  tracking: { address: '' }
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
  }
];

export const initialValues = {
  supplier: { initials: '' },
  tracking: { address: '' },
  items: [],

  // Modal related stuff
  // NOTE: Properties below should not be submitted as a payload
  listModal: listModalInitialValues
};

export const submitPayload = ({ items, ...purchaseOrder }) =>
  omit(
    {
      ...purchaseOrder,
      items: items.map(({ inventory, ...item }) => ({
        ...item,
        quantity: inventory.plusQuantity
      }))
    },
    ['listModal']
  );

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
    ...item.item,
    inventory: {
      ...item.item?.inventory,
      plusQuantity: item.quantity
    }
  }));

export const addedItemsHeaders = [
  {
    label: 'Quantity',
    accessKey: 'inventory.plusQuantity'
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
    label: 'Size',
    accessKey: 'size.name'
  },
  {
    label: 'Brand',
    accessKey: 'brand.name'
  }
];
