import cssClassModifier from 'js/utils/cssClassModifier';
import joinClassName from 'js/utils/joinClassName';

const ModalActions = ({ className, mode, children }) => (
  <div
    className={joinClassName(
      cssClassModifier('modal-actions', [mode], [mode]),
      className
    )}>
    {children}
  </div>
);

export default ModalActions;
