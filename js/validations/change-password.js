import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  oldPassword: Yup.string().required(message.required),
  newPassword: Yup.string()
    .min(8, 'Password is too short—should be 8 characters minimum.')
    .required(message.required),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Password does not match')
    .required(message.required)
});
