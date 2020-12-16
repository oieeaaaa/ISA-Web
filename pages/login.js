import { useRouter } from 'next/router';
import { Formik, Form } from 'formik';
import { useCookies } from 'react-cookie';
import useAppContext from 'js/contexts/app';
import { initialValues } from 'js/shapes/login';
import { AUTH_KEY } from 'js/shapes/cookies';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import parseCookies from 'js/utils/parseCookies';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import Button from 'components/button/button';

const Login = () => {
  const { notification } = useAppContext();
  const router = useRouter();
  const [, setCookie] = useCookies(AUTH_KEY);

  const handleSubmit = async (values) => {
    try {
      const { data, isSuccess, message } = await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values)
      });

      if (!isSuccess)
        return notification.open({
          variant: 'danger',
          message
        });

      setCookie(AUTH_KEY, data);
      router.push('/inventory');
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: 'Failed to login, please try again'
      });
    }
  };

  return (
    <div className="login">
      <h1 className="login__title">Login</h1>
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form className="login__form">
          <InputGroup label="Username" name="username" component={Input} />
          <InputGroup
            label="Password"
            name="password"
            type="password"
            component={Input}
          />
          <Button className="login__button" variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export function getServerSideProps({ req, res }) {
  const data = parseCookies(req);

  if (safety(data, AUTH_KEY, '')) {
    res.writeHead(301, { Location: '/' });
    res.end();
  }

  return { props: {} };
}

export default Login;
