import 'react-datepicker/dist/react-datepicker.css';
import 'scss/main.scss';

const App = ({ Component, pageProps }) => (
  <div className="app">
    <Component {...pageProps} />
  </div>
);

export default App;
