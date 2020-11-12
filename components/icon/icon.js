import { ReactSVG } from 'react-svg';

const Icon = ({ icon }) => (
  <ReactSVG
    className="icon"
    src={`/icons/${icon}.svg`}
  />
);

export default Icon;
