import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';

/**
 * Button.
 *
 * @param {object} props
 * @param {string} variant | default | primary | primary-v1
 */
// TODO: Create a function that contatenate classNames if the corresponding conditions are true
const Button = ({
  variant = 'default',
  icon = '',
  children,
  className,
  ...etc
}) => (
  <button
    className={`${cssClassModifier(
      'button',
      [variant, 'with-icon'],
      [variant, icon]
    )} ${className ? className : ''}`}
    type="button"
    {...etc}>
    {icon && <Icon icon={icon} />}
    {children}
  </button>
);

export default Button;
