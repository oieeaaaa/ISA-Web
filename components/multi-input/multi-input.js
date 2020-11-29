import { useEffect } from 'react';
import { useField } from 'formik';
import { safeType } from 'js/utils/safety';
import Button from 'components/button/button';

// TODO: Replace the custom input with Input component
const MultiInput = ({
  name,
  mainKey = 'name',
  customInput: CustomInput,
  ...etc
}) => {
  const [field, , helpers] = useField({
    name,
    multiple: true
  });

  const addField = () => {
    helpers.setValue(
      field.value.concat({
        [mainKey]: '',
        isNew: true
      })
    );
  };

  const removeField = (uniqueVal) => {
    helpers.setValue(field.value.filter((v) => v[mainKey] !== uniqueVal));
  };

  const handleChange = (uniqueVal) => {
    helpers.setValue(
      field.value.map((v) =>
        v[mainKey] === uniqueVal ? { ...v, [mainKey]: uniqueVal } : v
      )
    );
  };

  useEffect(() => {
    if (field.value.length) return;

    helpers.setValue([{ [mainKey]: '', isNew: true }]);
  }, [field.value]);

  return (
    <div className="multi-input">
      <ul className="multi-input__list">
        {field.value.map((value, index) => (
          <li key={value[mainKey]} className="multi-input__item">
            {CustomInput ? (
              <CustomInput
                name={`${name}[${index}]`}
                value={value}
                onChange={helpers.setValue}
              />
            ) : (
              <input
                className="multi-input__input"
                type="text"
                value={safeType.string(value[mainKey])}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={helpers.onBlur}
                {...etc}
              />
            )}
            {index !== 0 && (
              <Button
                className="multi-input__close"
                icon="x"
                onClick={() => removeField(value[mainKey])}
              />
            )}
          </li>
        ))}
      </ul>
      <Button className="multi-input__add" icon="plus" onClick={addField} />
    </div>
  );
};

export default MultiInput;
