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
  const routes = [
    {
      name: 'Inventory',
      location: '/inventory',
      icon: 'archive'
    },
    {
      name: 'Suppliers',
      location: '/supplier',
      icon: 'list'
    },
    {
      name: 'Sales Report',
      location: '/sales-report',
      icon: 'activity'
    }
  ];

  return (
    <aside className={cssClassModifier('sidebar', ['open'], [isSidebarOpen])}>
      <Button
        className="sidebar__close"
        icon="x"
        onClick={handlers.closeSidebar}
      />
      <ul className="sidebar-nav">
        {routes.map((route) => (
          <li
            key={route.location}
            className={cssClassModifier(
              'sidebar-nav__item',
              ['active'],
              [router.pathname.includes(route.location)]
            )}>
            <Link href={route.location}>
              <a className="sidebar-nav__link">
                <Icon icon={route.icon} />
                {route.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
