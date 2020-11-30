import { useRef, useEffect } from 'react';
import cssClassModifier from 'js/utils/cssClassModifier';
import Button from 'components/button/button';

const Modal = ({ isOpen, title, closeModal, children }) => {
  const modal = useRef(null);

  useEffect(() => {
    if (!modal) return;

    if (isOpen) {
      modal.current.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';

      setTimeout(() => {
        if (!modal.current) return;
        modal.current.style.display = 'none';
      }, 300);
    }
  }, [isOpen, modal]);

  return (
    <div ref={modal} className={cssClassModifier('modal', ['open'], [isOpen])}>
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal__title">{title}</h2>
            <Button className="modal__close" icon="x" onClick={closeModal} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
