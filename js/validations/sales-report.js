import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  type: Yup.object()
    .shape({
      name: Yup.string().required(message.required)
    })
    .required(message.required),
  name: Yup.string().required(message.required),
  items: Yup.array().required(message.required)
});
