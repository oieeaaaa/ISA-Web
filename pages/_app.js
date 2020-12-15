import { CookiesProvider } from 'react-cookie';

import 'react-datepicker/dist/react-datepicker.css';
import 'scss/main.scss';

import { AppProvider } from 'js/contexts/app';
import Notification from 'components/notification/notification';
import GridGuide from 'styleguide/grid-guide';

const App = ({ Component, pageProps }) => (
  <AppProvider>
    <CookiesProvider>
      <div className="app">
        <Component {...pageProps} />
        <Notification />
      </div>
      <GridGuide />
    </CookiesProvider>
  </AppProvider>
);

export default App;
