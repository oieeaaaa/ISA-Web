import { useField } from 'formik';

const InputDisplay = ({ name, formatVal, ...etc }) => {
  const [field] = useField(name);

  return (
    <div className="input-display" {...etc}>
      {formatVal ? formatVal(field.value) : field.value}
    </div>
  );
};

export default InputDisplay;
