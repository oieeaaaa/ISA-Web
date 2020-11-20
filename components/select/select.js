/* eslint jsx-a11y/control-has-associated-label: off */
import { useField } from 'formik';
import safety, { safeType } from 'js/utils/safety';
import Icon from 'components/icon/icon';

const Select = ({
  name,
  options = [],
  mainKey = 'id',
  displayKey = 'name',
  ...etc
}) => {
  const [field, , helpers] = useField(name);

  const onSelect = (e) => {
    const selectedItem = options.find(
      (option) => option[mainKey] === safeType.json(e.target.value),
    );

    helpers.setValue(safeType.object(selectedItem));
  };

  return (
    <div className="select-container">
      <select
        className="select"
        onChange={onSelect}
        onBlur={field.onBlur}
        value={safety(field, 'value', {})[mainKey]}
        {...etc}
      >
        <option value={undefined}>&nbsp;</option>
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
