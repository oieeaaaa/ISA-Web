import { useEffect } from 'react';
import { useFormikContext, useField } from 'formik';
import debounce from 'lodash.debounce';
import safety, { safeType } from 'js/utils/safety';
import Button from 'components/button/button';

// TODO: Replace the custom input with Input component
const MultiInput = ({
  name,
  mainKey = 'name',
  customInput: CustomInput,
  captureRemoved,
  noIsNew
}) => {
  const { values, setFieldValue } = useFormikContext();

  const [field, , helpers] = useField({
    name,
    multiple: true
  });

  const removedValuesName = `${name}X`;

  const addField = () => {
    let newValue = {
      [mainKey]: ''
    };

    if (!noIsNew) {
      newValue = {
        ...newValue,
        isNew: true
      };
    }

    helpers.setValue(field.value.concat(newValue));
  };

  // prevent duplicates
  const isInRemovedValues = (item) =>
    safeType
      .array(values[removedValuesName])
      .some((removedValue) => removedValue[mainKey] === item[mainKey]);

  const captureRemovedValue = (itemToRemove) => {
    if (!captureRemoved) return;

    if (isInRemovedValues(itemToRemove)) return;

    setFieldValue(
      removedValuesName,
      safeType.array(values[removedValuesName]).concat(itemToRemove)
    );
  };

  const putBackRemovedValue = debounce((itemToPutBack) => {
    if (!captureRemoved) return;

    if (!isInRemovedValues(itemToPutBack)) return;

    setFieldValue(
      removedValuesName,
      safeType
        .array(values[removedValuesName])
        .filter((rv) => rv[mainKey] !== itemToPutBack[mainKey])
    );
  }, 500);

  const removeField = (index, itemToRemove) => {
    helpers.setValue(field.value.filter((_, vIndex) => vIndex !== index));

    captureRemovedValue(itemToRemove);
  };

  const handleChange = (e, index, val) => {
    e.persist();

    putBackRemovedValue(val);

    field.value = safeType
      .array(field.value)
      .map((curVal, vIndex) => (vIndex === index ? val : curVal));

    helpers.setValue(field.value);
  };

  useEffect(() => {
    if (safety(field, 'value.length', 0)) return;

    let newValue = {
      [mainKey]: ''
    };

    if (!noIsNew) {
      newValue = {
        ...newValue,
        isNew: true
      };
    }

    helpers.setValue([newValue]);
  }, [field.value]);

  return (
    <div className="multi-input">
      <ul className="multi-input__list">
        {safeType.array(field.value).map((value, index) => (
          <li key={index} className="multi-input__item">
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
                onChange={(e) =>
                  handleChange(e, index, {
                    ...value,
                    [mainKey]: e.target.value
                  })
                }
                onBlur={helpers.onBlur}
              />
            )}
            {index !== 0 && (
              <Button
                className="multi-input__close"
                icon="x"
                onClick={() => removeField(index, value)}
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
