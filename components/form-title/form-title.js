import Icon from 'components/icon/icon';

const FormTitle = ({ icon, title }) => (
  <div className="form-title">
    <Icon icon={icon} />
    <h1 className="form-title__text">{title}</h1>
  </div>
);

export default FormTitle;
