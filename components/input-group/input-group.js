import { useFormikContext } from 'formik';
import safety from 'js/utils/safety';

const InputGroup = ({ name, label, component: Component, error, ...etc }) => {
  const { errors } = useFormikContext();

  return (
    <div className={`input-group input-group--${name}`}>
      <label className="input-group__label" htmlFor={name}>
        {label}
      </label>
      <Component id={name} name={name} {...etc} />
      {safety(errors, name) && (
        <p className="input-group__error">{error || safety(errors, name)}</p>
      )}
    </div>
  );
};

export default InputGroup;
