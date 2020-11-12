import GridGuide from 'styleguide/grid-guide';
import Header from 'components/header/header';
import Footer from 'components/footer/footer';

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
    <GridGuide />
  </>
);

export default Layout;
