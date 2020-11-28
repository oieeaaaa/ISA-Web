import Router from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import { submitPayload, initialValues } from 'js/shapes/purchase-order';
import validationSchema from 'js/validations/purchase-order';

// components
import Layout from 'components/layout/layout';
import PurchaseOrderForm from 'components/purchase-order-form/purchase-order-form';

const PurchaseOrderAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values, actions) => {
    try {
      await fetcher('/purchase-order', {
        method: 'POST',
        body: JSON.stringify(submitPayload(values))
      });

      actions.resetForm();
      Router.push('/purchase-order');
      notification.open({
        variant: 'success',
        message: messages.success.add
      });
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.add
      });
    }
  };

  return (
    <Layout>
      <Formik initialValues={initialValues} validationSchema={validationSchema}>
        <PurchaseOrderForm helpers={helpers} onSubmit={handleSubmit} />
      </Formik>
    </Layout>
  );
};

export async function getStaticProps() {
  const suppliers = await fetcher('/helpers/supplier');

  return {
    props: {
      helpers: {
        suppliers: suppliers.data
      }
    }
  };
}

export default PurchaseOrderAdd;
