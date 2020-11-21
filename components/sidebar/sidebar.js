import { useRouter } from 'next/router';
import Link from 'next/link';
import useLayoutContext from 'js/contexts/layout';
import cssClassModifier from 'js/utils/cssClassModifier';
import Button from 'components/button/button';
import Icon from 'components/icon/icon';

const Sidebar = () => {
  // contexts
  const { isSidebarOpen, handlers } = useLayoutContext();

  // custom hooks
  const router = useRouter();

  return (
    <aside className={cssClassModifier('sidebar', ['open'], [isSidebarOpen])}>
      <div className="grid">
        <Button
          className="sidebar__close"
          icon="x"
          onClick={handlers.closeSidebar}
        />
        <ul className="sidebar-nav">
          <li
            className={cssClassModifier(
              'sidebar-nav__item',
              ['active'],
              [router.pathname === '/inventory']
            )}>
            <Link href="/inventory">
              <a className="sidebar-nav__link">
                <Icon icon="archive" />
                Inventory
              </a>
            </Link>
          </li>
          <li className="sidebar-nav__item">
            <Link href="/suppliers">
              <a className="sidebar-nav__link">
                <Icon icon="list" />
                Suppliers
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
