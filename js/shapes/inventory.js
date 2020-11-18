import {
  connectOrCreateMultiple,
  connectOrCreateSingle,
} from 'js/utils/connectOrCreate';

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
  brand: { name: '' },
  supplier: { id: '', name: '' },
  description: '',

  // pricing
  codes: [],
  uom: { name: '' },
  srp: 0,

  // other info
  remarks: '',
  receivedBy: '',
  checkedBy: '',
  codedBy: '',
};

export const addPayload = ({
  applications,
  codes,
  uom,
  brand,
  supplier,
  ...payload
}) => ({
  ...payload,
  applications: connectOrCreateMultiple(applications),
  brand: connectOrCreateSingle(brand),
  uom: connectOrCreateSingle(uom),
  codes: {
    connect: codes,
  },
  supplier: {
    connect: {
      id: supplier.id,
    },
  },
});

export default {
  initialValues,
  addPayload,
};
