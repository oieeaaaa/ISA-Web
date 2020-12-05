import Router from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import safety from 'js/utils/safety';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import { initialValues } from 'js/shapes/stock-in';
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
        body: JSON.stringify(values)
      });

      notification.open({
        variant: 'success',
        message: messages.success.add
      });

      Router.push(`/stock-in/${data.id}`);
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.add
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

export async function getStaticProps() {
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
