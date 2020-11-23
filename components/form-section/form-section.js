import toKebabCase from 'js/utils/toKebabCase';
import FormSectionTitle from 'components/form-section-title/form-section-title';

const FormSection = ({ title, children }) => (
  <div className={`form-section form-section--${toKebabCase(title)}`}>
    <FormSectionTitle title={title} />
    <div className="form-section__content">{children}</div>
  </div>
);

export default FormSection;
