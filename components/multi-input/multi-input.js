import { useEffect } from 'react';
import { useField } from 'formik';
import set from 'lodash.set';
import { safeType } from 'js/utils/safety';
import Button from 'components/button/button';

const MultiInput = ({ name, mainKey, ...etc }) => {
  const [field, , helpers] = useField({
    name,
    multiple: true
  });

  const addField = () => {
    const newValue = field.value.concat({ [mainKey]: null, isNew: true });
    helpers.setValue(newValue);
  };

  const removeField = (index) => {
    helpers.setValue(field.value.filter((_, valIndex) => valIndex !== index));
  };

  const handleChange = (index) => (e) => {
    field.value[index] = set(
      safeType.object(field.value[index]),
      mainKey,
      e.target.value
    );

    helpers.setValue(field.value);
  };

  useEffect(() => {
    if (field.value.length) return;

    helpers.setValue([{ [mainKey]: null, isNew: true }]);
  }, [field.value]);

  return (
    <div className="multi-input">
      <ul className="multi-input__list">
        {field.value.map((value, index) => (
          <li key={index} className="multi-input__item">
            <input
              className="multi-input__input"
              type="text"
              value={safeType.string(value[mainKey])}
              onChange={handleChange(index)}
              onBlur={helpers.onBlur}
              {...etc}
            />
            {index !== 0 && (
              <Button
                className="multi-input__close"
                icon="x"
                onClick={() => removeField(index)}
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
