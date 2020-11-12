import Input from 'components/input/input';

const InputGroup = ({ name, label, ...etc }) => (
  <div className="input-group">
    <label className="input-group__label" htmlFor={name}>
      {label}
    </label>
    <Input id={name} {...etc} />
  </div>
);

export default InputGroup;
