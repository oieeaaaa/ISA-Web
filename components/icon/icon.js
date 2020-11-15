import { ReactSVG } from 'react-svg';
import joinClassName from 'js/utils/joinClassName';

const Icon = ({ className, icon }) => (
  <ReactSVG
    className={joinClassName('icon', className)}
    src={`/icons/${icon}.svg`}
  />
);

export default Icon;
