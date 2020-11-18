import { PureComponent } from 'react';
import { useField } from 'formik';
import DatePicker from 'react-datepicker';
import Icon from 'components/icon/icon';

class DatePickerInput extends PureComponent {
  render() {
    const { value, onClick } = this.props;

    return (
      <button className="date-picker-input" onClick={onClick} type="button">
        <span className="date-picker-input__value">{value}</span>
        <Icon icon="calendar" />
      </button>
    );
  }
}

const CustomerDatePicker = ({ name, ...etc }) => {
  const [field, , helpers] = useField(name);

  const handleChange = (date) => {
    helpers.setValue({ [name]: date });
  };

  return (
    <DatePicker
      className="date-picker"
      customInput={<DatePickerInput />}
      value={field.value}
      selected={field.value}
      onChange={handleChange}
      {...etc}
    />
  );
};

export default CustomerDatePicker;
