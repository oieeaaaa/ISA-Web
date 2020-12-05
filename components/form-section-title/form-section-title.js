import joinClassName from 'js/utils/joinClassName';

const FormSectionTitle = ({ className, title }) => (
  <h3 className={joinClassName('form-section-title', className)}>{title}</h3>
);

export default FormSectionTitle;
