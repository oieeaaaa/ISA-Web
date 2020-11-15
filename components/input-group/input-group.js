const InputGroup = ({
  name,
  label,
  component: Component,
  ...etc
}) => (
  <div className={`input-group input-group--${name}`}>
    <label className="input-group__label" htmlFor={name}>
      {label}
    </label>
    <Component id={name} name={name} {...etc} />
  </div>
);

export default InputGroup;
