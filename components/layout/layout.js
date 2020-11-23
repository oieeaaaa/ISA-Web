import { LayoutProvider } from 'js/contexts/layout';
import GridGuide from 'styleguide/grid-guide';
import Header from 'components/header/header';
import Sidebar from 'components/sidebar/sidebar';
import Footer from 'components/footer/footer';

const Layout = ({ children }) => (
  <LayoutProvider>
    <Header />
    <div className="layout">
      <Sidebar />
      <div className="main-content">{children}</div>
      <Footer />
      <GridGuide />
    </div>
  </LayoutProvider>
);

export default Layout;
