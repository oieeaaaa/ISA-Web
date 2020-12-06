import { useState, useCallback, useEffect } from 'react';
import throttle from 'lodash.throttle';
import breakpoint from 'js/utils/breakpoint';
import cssClassModifier from 'js/utils/cssClassModifier';
import FormTitle from 'components/form-title/form-title';

const FormActions = ({ title, icon, className, children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollListener = useCallback(
    throttle(() => {
      if (breakpoint() !== 'desktop') return;

      if (window.scrollY >= 90) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 100)
  );

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);

    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  return (
    <div
      className={cssClassModifier(
        'form-actions',
        ['scrolled', className],
        [isScrolled, className]
      )}>
      <div className="form-actions-container">
        <FormTitle icon={icon} title={title} />
      </div>
      <div className="form-actions-body">{children}</div>
    </div>
  );
};

export default FormActions;
