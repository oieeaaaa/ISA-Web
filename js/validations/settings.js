import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  codes: Yup.array().required(message.required)
});
