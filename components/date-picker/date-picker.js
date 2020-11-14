import { PureComponent } from 'react';
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

const CustomerDatePicker = ({ ...etc }) => (
  <DatePicker
    className="date-picker"
    customInput={<DatePickerInput />}
    {...etc}
  />
);

export default CustomerDatePicker;
