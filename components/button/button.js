/**
 * Button.
 *
 * @param {object} props
   * @param {string} variant | default | primary
 */
const Button = ({ variant = 'default', children, ...etc }) => (
  <button
    className={`button button--${variant}`}
    type="button"
    {...etc}
  >
    {children}
  </button>
);

export default Button;
