import Head from 'next/head';
import { LayoutProvider } from 'js/contexts/layout';
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
    </div>
  </LayoutProvider>
);

export default Layout;
