import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must have at least 3 characters.')
    .required(message.required)
});
