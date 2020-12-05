import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  referenceNumber: Yup.string().required(message.required),
  referenceDate: Yup.date().required(message.required),
  supplier: Yup.object().shape({ id: Yup.string().required(message.required) }),
  items: Yup.array().required(message.required)
});
