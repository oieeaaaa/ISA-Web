import toKebabCase from 'js/utils/toKebabCase';
import FormSectionTitle from 'components/form-section-title/form-section-title';

const FormSection = ({ title, children }) => (
  <div className={`form-section form-section--${toKebabCase(title)}`}>
    <FormSectionTitle title={title} />
    {children}
  </div>
);

export default FormSection;
