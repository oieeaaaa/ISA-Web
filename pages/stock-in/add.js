import Router from 'next/router';
import { Formik } from 'formik';
import safety from 'js/utils/safety';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import { submitPayload, initialValues } from 'js/shapes/stock-in';
import validationSchema from 'js/validations/stock-in';

// components
import Layout from 'components/layout/layout';
import StockInForm from 'components/stock-in-form/stock-in-form';

const StockInAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values) => {
    try {
      const { data } = await fetcher('/stock-in', {
        method: 'POST',
        body: JSON.stringify(submitPayload(values))
      });

      notification.open({
        variant: 'success',
        message: 'Added new stock in'
      });

      // go to edit
      Router.push(`/stock-in/${data[0].id}`);
    } catch (error) {
      notification.open({
        variant: 'danger',
        message:
          'Failed to add stock in, please double check your inputs and try again'
      });
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}>
        <StockInForm helpers={helpers} onSubmit={handleSubmit} />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

  const suppliers = await fetcher('/helpers/supplier');
  const codedBy = await fetcher('/helpers/coded-by');
  const checkedBy = await fetcher('/helpers/checked-by');
  const receivedBy = await fetcher('/helpers/received-by');

  return {
    props: {
      helpers: {
        suppliers: safety(suppliers, 'data', []),
        codedBy: safety(codedBy, 'data', []),
        receivedBy: safety(receivedBy, 'data', []),
        checkedBy: safety(checkedBy, 'data', [])
      }
    }
  };
}

export default StockInAdd;
