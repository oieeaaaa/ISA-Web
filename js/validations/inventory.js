import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  dateReceived: Yup.date().required(message.required),

  // reference
  referenceNumber: Yup.string().required(message.required),
  referenceDate: Yup.date().required(message.required),

  // details
  particular: Yup.string().required(message.required),
  partsNumber: Yup.string().required(message.required),
  size: Yup.string().required(message.required),
  quantity: Yup.number().min(1).required(message.required),
  applications: Yup.array().required(message.required),
  brand: Yup.object().shape({ name: Yup.string().required(message.required) }),
  supplier: Yup.object().shape({ id: Yup.string().required(message.required) }),
  description: Yup.string().min(50, message.min),

  // pricing
  codes: Yup.array().required(message.required),
  uom: Yup.object().shape({ name: Yup.string().required(message.required) }),
  srp: Yup.number(),

  // other info
  remarks: Yup.string().min(50, message.min),
  receivedBy: Yup.string().min(10, message.min).max(150, message.max),
  checkedBy: Yup.string().min(10, message.min).max(150, message.max),
  codedBy: Yup.string().min(10, message.min).max(150, message.max),
});
