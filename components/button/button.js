import joinClassName from 'js/utils/joinClassName';
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
    className={joinClassName(
      `button button--${variant} ${icon ? 'button--with-icon' : ''}`,
      className
    )}
    type="button"
    {...etc}>
    {icon && <Icon icon={icon} />}
    {children}
  </button>
);

export default Button;
