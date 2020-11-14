import Icon from 'components/icon/icon';

const Select = ({ options = [], ...etc }) => (
  <div className="select-container">
    <select className="select" {...etc}>
      {options.map((option) => (
        <option key={option.id}>{option.name}</option>
      ))}
    </select>
    <Icon icon="chevron-down" />
  </div>
);

export default Select;
