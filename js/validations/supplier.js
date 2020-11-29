import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  // required
  vendor: Yup.string().required(message.required),
  entry: Yup.date().required(message.required),
  initials: Yup.string().required(message.required),
  terms: Yup.number().min(0).required(message.required)
});
