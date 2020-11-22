import { useField } from 'formik';
import DatePicker from 'react-datepicker';
import { safeType } from 'js/utils/safety';

const DateRangePicker = ({ name, ...etc }) => {
  const [field, , helpers] = useField(name);

  const handleChange = (dates) => {
    helpers.setValue(dates);
  };

  return (
    <DatePicker
      className="date-picker"
      selected={safeType.date(safeType.array(field.value)[0])}
      startDate={safeType.date(safeType.array(field.value)[0])}
      endDate={safeType.date(safeType.array(field.value)[1])}
      onChange={handleChange}
      dateFormat="MMMM d, yyyy"
      selectsRange
      inline
      {...etc}
    />
  );
};

export default DateRangePicker;
