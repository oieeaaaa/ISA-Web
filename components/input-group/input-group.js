import { useFormikContext } from 'formik';

const InputGroup = ({
  name,
  label,
  component: Component,
  error,
  ...etc
}) => {
  const { errors } = useFormikContext();

  return (
    <div className={`input-group input-group--${name}`}>
      <label className="input-group__label" htmlFor={name}>
        {label}
      </label>
      <Component id={name} name={name} {...etc} />
      {errors[name] && (
        <p className="input-group__error">{error || errors[name]}</p>
      )}
    </div>
  );
};

export default InputGroup;
