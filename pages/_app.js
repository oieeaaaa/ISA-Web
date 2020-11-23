import 'react-datepicker/dist/react-datepicker.css';
import 'scss/main.scss';

import { AppProvider } from 'js/contexts/app';
import Notification from 'components/notification/notification';

const App = ({ Component, pageProps }) => (
  <AppProvider>
    <div className="app">
      <Component {...pageProps} />
      <Notification />
    </div>
  </AppProvider>
);

export default App;
