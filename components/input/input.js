import { Field } from 'formik';
import joinClassName from 'js/utils/joinClassName';

const Input = ({ className, ...etc }) => (
  <Field className={joinClassName('input', className)} type="text" {...etc} />
);

export default Input;
