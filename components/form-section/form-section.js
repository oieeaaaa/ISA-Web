import FormSectionTitle from 'components/form-section-title/form-section-title';

const FormSection = ({ title, children }) => (
  <div className="form-section">
    <FormSectionTitle title={title} />
    {children}
  </div>
);

export default FormSection;
