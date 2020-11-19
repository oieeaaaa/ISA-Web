/* eslint jsx-a11y/control-has-associated-label: off */
import { useField } from 'formik';
import safety from 'js/utils/safety';
import Icon from 'components/icon/icon';

const Select = ({
  id,
  name,
  options = [],
  mainKey = 'id',
  displayKey = 'name',
  ...etc
}) => {
  const [field, , helpers] = useField(name);

  const onSelect = (e) => {
    const selectedItem = options.find((option) => option[mainKey] === e.target.value);

    helpers.setValue(selectedItem);
  };

  return (
    <div className="select-container">
      <select
        id={id}
        className="select"
        onChange={onSelect}
        onBlur={field.onBlur}
        value={safety(field, 'value', {})[mainKey]}
        {...etc}
      >
        <option value="" disabled />
        {options.map((option) => (
          <option key={option[mainKey]} value={option[mainKey]}>
            {option[displayKey]}
          </option>
        ))}
      </select>
      <Icon icon="chevron-down" />
    </div>
  );
};

export default Select;
