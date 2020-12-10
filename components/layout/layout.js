import Head from 'next/head';
import { LayoutProvider } from 'js/contexts/layout';
import GridGuide from 'styleguide/grid-guide';
import Header from 'components/header/header';
import Sidebar from 'components/sidebar/sidebar';

const Layout = ({ children }) => (
  <LayoutProvider>
    <Header />
    <div className="layout">
      <Head>
        <title>ASK</title>
      </Head>
      <Sidebar />
      <div className="main-content">{children}</div>
      <GridGuide />
    </div>
  </LayoutProvider>
);

export default Layout;
