import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  // required
  vendor: Yup.string().required(message.required),
  entry: Yup.date().required(message.required),
  initials: Yup.string().required(message.required),
  terms: Yup.number().min(0).required(message.required),

  // optional
  owner: Yup.string(),
  tin: Yup.string(),
  representative: Yup.string(),
  address: Yup.string(),
  brands: Yup.array(),
  companyPhoneNumbers: Yup.array(),
  representativePhoneNumbers: Yup.array(),
  emails: Yup.array()
});
