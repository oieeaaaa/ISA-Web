import omit from 'lodash.omit';
import dateFormat from 'js/utils/dateFormat';

export const stockInAttributes = {
  id: true,
  dateCreated: true,
  dateReceived: true,
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
  dateReceived: new Date(),
  referenceNumber: '',
  referenceDate: new Date(),
  remarks: '',
  receivedBy: { receivedBy: '' },
  checkedBy: { checkedBy: '' },
  codedBy: { codedBy: '' },

  supplier: {
    id: '',
    initials: ''
  },
  items: [],
  removedItems: [],

  // don't send this to BE
  listModal: {
    data: {},
    quantity: ''
  },
  inventoryModal: {
    particular: { particular: '' },
    partsNumber: { partsNumber: '' },
    quantity: 0,
    uom: { name: '' },
    codes: '',
    srp: 0,
    description: '',
    applications: [],
    variant: {
      name: '',
      size: { name: '' },
      brand: { name: '' },
      supplier: { initials: '' }
    }
  }
};

export const tableHeaders = [
  {
    label: 'Date Created',
    accessKey: 'dateCreated',
    customCell: ({ value }) => dateFormat(value)
  },
  {
    label: 'Date Received',
    accessKey: 'dateReceived',
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
  dateReceived: null,
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
    label: 'Variant Name',
    accessKey: 'name'
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

export const submitPayload = ({
  receivedBy,
  codedBy,
  checkedBy,
  items,
  ...stockIn
}) =>
  omit(
    {
      ...stockIn,
      receivedBy: receivedBy.receivedBy,
      codedBy: codedBy.codedBy,
      checkedBy: checkedBy.checkedBy,
      items: items.map(({ id, inventory }) => ({
        id,
        inventoryID: inventory.id,
        quantity: Number(inventory.plusQuantity)
      }))
    },
    ['removedItems']
  );

export const editInitialPayload = ({
  items,
  checkedBy,
  receivedBy,
  codedBy,
  ...payload
}) => ({
  ...payload,
  receivedBy: {
    receivedBy: receivedBy
  },
  codedBy: {
    codedBy: codedBy
  },
  checkedBy: {
    checkedBy: checkedBy
  },
  items: items.map(({ id, quantity, item }) => ({
    ...item,
    itemID: id,
    prevQty: quantity,
    inventory: {
      ...item.inventory,
      plusQuantity: quantity
    }
  }))
});

export const editPayload = ({
  receivedBy,
  codedBy,
  checkedBy,
  items,
  removedItems,
  ...stockIn
}) => ({
  ...stockIn,
  receivedBy: receivedBy.receivedBy,
  codedBy: codedBy.codedBy,
  checkedBy: checkedBy.checkedBy,
  items: items.map(({ id: variantID, itemID, prevQty, inventory }) => ({
    prevQty,
    itemID,
    variantID,
    inventoryID: inventory.id,
    quantity: Number(inventory.plusQuantity)
  })),
  removedItems: removedItems.map(({ itemID, inventory }) => ({
    itemID,
    inventoryID: inventory.id,
    quantity: Number(inventory.plusQuantity)
  }))
});
