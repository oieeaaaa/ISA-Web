const ModalInfoDetails = ({ details }) => (
  <ul className="modal-info-details">
    {details.map((detail) => (
      <li className="modal-info-details__detail" key={detail.title}>
        <span className="modal-info-details__detail-title">{detail.title}</span>
        <span className="modal-info-details__detail-value">{detail.value}</span>
      </li>
    ))}
  </ul>
);

export default ModalInfoDetails;
