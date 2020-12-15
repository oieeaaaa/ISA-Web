import Router from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import safety from 'js/utils/safety';
import { submitPayload, initialValues } from 'js/shapes/purchase-order';
import validationSchema from 'js/validations/purchase-order';

// components
import Layout from 'components/layout/layout';
import PurchaseOrderForm from 'components/purchase-order-form/purchase-order-form';

const PurchaseOrderAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values) => {
    try {
      const { data } = await fetcher('/purchase-order', {
        method: 'POST',
        body: JSON.stringify(submitPayload(values))
      });

      notification.open({
        variant: 'success',
        message: 'Added new purchase order'
      });

      Router.push(`/purchase-order/${data.id}`);
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
        <PurchaseOrderForm helpers={helpers} onSubmit={handleSubmit} />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

  const suppliers = await fetcher('/helpers/supplier');

  return {
    props: {
      helpers: {
        suppliers: safety(suppliers, 'data', [])
      }
    }
  };
}

export default PurchaseOrderAdd;
