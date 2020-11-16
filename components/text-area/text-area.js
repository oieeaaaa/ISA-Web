import { Field } from 'formik';

const TextArea = ({ ...etc }) => (
  <Field className="text-area" as="textarea" {...etc} />
);

export default TextArea;
