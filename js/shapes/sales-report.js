import omit from 'lodash.omit';
import { safeType } from 'js/utils/safety';
import dateFormat from 'js/utils/dateFormat';
import toMoney from 'js/utils/toMoney';
import { initialValues as listModalInitialValues } from 'js/shapes/add-to-list-modal';

export const types = [
  {
    name: 'Sale'
  },
  {
    name: 'Account'
  }
];

export const paymentTypes = [
  {
    name: 'Cheque'
  },
  {
    name: 'Cash'
  }
];

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => dateFormat(value)
  },
  {
    label: 'Type',
    accessKey: 'type'
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
    accessKey: 'paymentType'
  },
  {
    label: 'Cheque Number',
    accessKey: 'chequeNumber'
  },
  {
    label: 'Cheque Date',
    accessKey: 'chequeDate',
    customCell: ({ value }) => (value ? dateFormat(value) : 'N/A')
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
    accessKey: 'totalSoldItems'
  }
];

export const tableFilters = {
  dateCreated: null,
  paymentType: {},
  customer: {},
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
    key: 'type'
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
    key: 'paymentType'
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
  }
];

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

export const initialValues = {
  // common fields
  name: '',
  address: '',
  discount: 0.0,
  type: { name: '' },
  salesStaff: [],
  items: [],
  removedItems: [],

  // if type is sale
  saleFields: {
    siNumber: '',
    arsNumber: '',
    tin: '',
    paymentType: { name: '' },
    chequeNumber: '',
    chequeDate: new Date(),
    amount: 0.0,
    bank: { name: '' }
  },

  // if type is account
  accountFields: {
    drNumber: '',
    crsNumber: ''
  },

  // NOTE: Properties below should not be submitted as a payload
  listModal: listModalInitialValues
};

export const submitPayload = ({
  items,
  accountFields,
  saleFields,
  type,
  ...payload
}) => {
  let newPayload = {
    ...omit(payload, ['listModal', 'removedItems']),
    type: type.name,
    soldItems: items.map(({ id, inventory }) => ({
      id,
      inventoryID: inventory.id,
      quantity: inventory.plusQuantity
    }))
  };

  switch (newPayload.type) {
    case 'Account':
      return {
        ...accountFields,
        ...newPayload
      };

    case 'Sale':
      return {
        ...saleFields,
        paymentType: saleFields.paymentType?.name
      };

    default:
      return newPayload;
  }
};

export const editPayload = ({
  items,
  accountFields,
  saleFields,
  type,
  removedItems,
  ...payload
}) => ({
  ...omit(payload, ['listModal']),
  ...accountFields,
  ...saleFields,
  type: type.name,
  paymentType: saleFields?.paymentType.name,
  soldItems: items.map(({ id, prevQty, itemID, inventory }) => ({
    prevQty,
    itemID,
    variantID: id,
    inventoryID: inventory.id,
    quantity: Number(inventory.plusQuantity)
  })),
  removedItems: removedItems.map(({ itemID, inventory }) => ({
    itemID,
    inventoryID: inventory.id,
    quantity: Number(inventory.plusQuantity)
  }))
});

export const toItems = (items) =>
  items.map((item) => ({
    ...item.item,
    prevQty: item.quantity,
    itemID: item.id,
    inventory: {
      ...item.item?.inventory,
      plusQuantity: item.quantity
    }
  }));

export const editInitialPayload = ({
  // common
  type,

  // account
  drNumber,
  crsNumber,

  // sale
  siNumber,
  arsNumber,
  tin,
  bank,
  chequeNumber,
  chequeDate,
  paymentType,

  // sold items
  soldItems,

  // others
  ...payload
}) => ({
  type: {
    name: type
  },
  accountFields: {
    drNumber,
    crsNumber
  },
  saleFields: {
    siNumber,
    arsNumber,
    tin,
    chequeNumber,
    chequeDate,
    bank: safeType.object(bank),
    paymentType: { name: safeType.string(paymentType) }
  },
  items: toItems(soldItems),
  ...payload
});
