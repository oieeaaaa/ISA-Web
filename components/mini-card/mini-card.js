const MiniCard = ({ title, content }) => (
  <div className="mini-card">
    <h4 className="mini-card__title">{title}</h4>
    <p className="mini-card__content">{content}</p>
  </div>
);

export default MiniCard;
