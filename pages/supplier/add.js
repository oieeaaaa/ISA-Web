import Router from 'next/router';
import { Formik } from 'formik';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import safety from 'js/utils/safety';
import { initialValues } from 'js/shapes/suppliers';
import validationSchema from 'js/validations/supplier';

// components
import Layout from 'components/layout/layout';
import SupplierForm from 'components/supplier-form/supplier-form';

const SupplierAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values) => {
    try {
      const { data } = await fetcher('/supplier', {
        method: 'POST',
        body: JSON.stringify(values)
      });

      notification.open({
        variant: 'success',
        message: 'Added new supplier'
      });

      Router.push(`/supplier/${data.id}`);
    } catch (error) {
      notification.open({
        variant: 'danger',
        message:
          'Failed to add supplier, please double check your inputs and try again.'
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
        <SupplierForm helpers={helpers} onSubmit={handleSubmit} />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

  const brands = await fetcher('/helpers/brand');

  return {
    props: {
      helpers: {
        brands: safety(brands, 'data', [])
      }
    }
  };
}

export default SupplierAdd;
