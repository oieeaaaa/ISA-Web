import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  type: Yup.object().shape({
    name: Yup.string().required(message.required)
  }),
  dateCreated: Yup.date().required(message.required),
  name: Yup.string().required(message.required),
  soldItems: Yup.array().required(message.required),

  tin: Yup.string(),
  siNumber: Yup.string(),
  arsNumber: Yup.string(),
  drNumber: Yup.string(),
  crsNumber: Yup.string(),
  address: Yup.string(),
  chequeNumber: Yup.string(),
  chequeDate: Yup.date().nullable(),
  discount: Yup.number(),
  salesStaff: Yup.array(),
  paymentType: Yup.object(),
  bank: Yup.object()
});
