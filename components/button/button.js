/**
 * Button.
 *
 * @param {object} props
   * @param {string} variant | default | primary
 */
const Button = ({ variant = 'default', children }) => (
  <button className={`button button--${variant}`} type="button">
    {children}
  </button>
);

export default Button;
