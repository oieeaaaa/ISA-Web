import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  particular: Yup.string().required(message.required),
  partsNumber: Yup.string().required(message.required),
  quantity: Yup.number()
    .min(1, 'Quantity must be greater than or equal to 1')
    .required(message.required),
  applications: Yup.array().required(message.required),
  uom: Yup.object()
    .shape({
      name: Yup.string().required(message.required)
    })
    .required(message.required),
  variantModal: Yup.object().shape({
    name: Yup.string().required(message.required),
    codes: Yup.string().required(message.required),
    unitCost: Yup.number(),
    size: Yup.object()
      .shape({
        name: Yup.string().required(message.required)
      })
      .required(message.required),
    supplier: Yup.object()
      .shape({
        initials: Yup.string().required(message.required)
      })
      .required(message.required)
  })
});
