import * as Yup from 'yup';
import messages from 'js/messages';

const { validation: message } = messages;

export default Yup.object().shape({
  referenceNumber: Yup.string().required(message.required),
  referenceDate: Yup.date().required(message.required),
  supplier: Yup.object()
    .shape({
      id: Yup.string().required(message.required)
    })
    .required(message.required),
  items: Yup.array().required(message.required),

  // Inventory Modal
  inventoryModal: Yup.object().shape({
    particular: Yup.object()
      .shape({
        particular: Yup.string().required(message.required)
      })
      .required(message.required),
    partsNumber: Yup.object()
      .shape({
        partsNumber: Yup.string().required(message.required)
      })
      .required(message.required),
    quantity: Yup.number()
      .min(1, 'Quantity must be greater than or equal to 1')
      .required(message.required),
    applications: Yup.array().required(message.required),
    uom: Yup.object()
      .shape({
        name: Yup.string().required(message.required)
      })
      .required(message.required),
    variant: Yup.object().shape({
      name: Yup.string().required(message.required),
      codes: Yup.string().required(message.required),
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
  })
});
