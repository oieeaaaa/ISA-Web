import { LayoutProvider } from 'js/contexts/layout';
import GridGuide from 'styleguide/grid-guide';
import Header from 'components/header/header';
import Sidebar from 'components/sidebar/sidebar';

const Layout = ({ children }) => (
  <LayoutProvider>
    <Header />
    <div className="layout">
      <Sidebar />
      <div className="main-content">{children}</div>
      <GridGuide />
    </div>
  </LayoutProvider>
);

export default Layout;
