import { useEffect } from 'react';
import useAppContext from 'js/contexts/app';
import cssClassModifier from 'js/utils/cssClassModifier';

const Notification = () => {
  const { notification } = useAppContext();
  const {
    isActive,
    duration = 300,
    message,
    variant,
    close,
    component: Component
  } = notification;

  useEffect(() => {
    setTimeout(() => {
      close();
    }, duration);
  }, [isActive]);

  return (
    <div
      className={cssClassModifier(
        'notification',
        ['active', variant],
        [isActive, variant]
      )}>
      {Component ? <Component /> : message}
    </div>
  );
};

export default Notification;
