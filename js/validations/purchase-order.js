import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  supplier: Yup.object().shape({
    id: Yup.string().required(message.required)
  }),
  dateCreated: Yup.date().required(message.required),
  items: Yup.array().required(message.required)
});
