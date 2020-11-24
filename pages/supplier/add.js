import Router from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import { submitPayload, initialValues } from 'js/shapes/suppliers';
import validationSchema from 'js/validations/supplier';

// components
import Layout from 'components/layout/layout';
import SupplierForm from 'components/supplier-form/supplier-form';

const SupplierAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values, actions) => {
    try {
      await fetcher('/supplier', {
        method: 'POST',
        body: JSON.stringify(submitPayload(values))
      });

      actions.resetForm();
      Router.push('/supplier');
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <SupplierForm helpers={helpers} />
      </Formik>
    </Layout>
  );
};

export async function getStaticProps() {
  const brands = await fetcher('/helpers/brand');

  return {
    props: {
      helpers: {
        brands: brands.data
      }
    }
  };
}

export default SupplierAdd;
