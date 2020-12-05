import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';

const Checkbox = ({ value, ...rest }) => (
  <button
    className={cssClassModifier('checkbox', ['checked'], [value])}
    {...rest}
    type="button">
    <Icon icon="check" />
  </button>
);

export default Checkbox;
