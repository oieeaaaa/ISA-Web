/* eslint jsx-a11y/control-has-associated-label: off */
import { useField } from 'formik';
import Icon from 'components/icon/icon';

const Select = ({
  id,
  name,
  options = [],
  accessKey = 'name',
  displayKey = 'name',
  ...etc
}) => {
  const [field, , helpers] = useField(name);

  const onSelect = (e) => {
    const selectedItem = options.find((option) => option[accessKey] === e.target.value);

    helpers.setValue(selectedItem);
  };

  return (
    <div className="select-container">
      <select
        id={id}
        className="select"
        onChange={onSelect}
        onBlur={field.onBlur}
        value={field.value[accessKey]}
        {...etc}
      >
        <option value="" disabled />
        {options.map((option) => (
          <option key={option[accessKey]} value={option[accessKey]}>
            {option[displayKey]}
          </option>
        ))}
      </select>
      <Icon icon="chevron-down" />
    </div>
  );
};

export default Select;
