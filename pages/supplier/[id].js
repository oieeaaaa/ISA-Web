import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import { initialValues } from 'js/shapes/suppliers';
import validationSchema from 'js/validations/supplier';

// components
import Layout from 'components/layout/layout';
import SupplierForm from 'components/supplier-form/supplier-form';

const SupplierItem = ({ item, helpers }) => {
  const { notification } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (values, actions) => {
    try {
      await fetcher(`/supplier/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      });

      actions.resetForm();
      router.push('/supplier');
      notification.open({
        variant: 'success',
        message: messages.success.update
      });
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.update
      });
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={{
          ...initialValues,
          ...item
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <SupplierForm mode="edit" helpers={helpers} />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const item = await fetcher(`/supplier/${params.id}`);
  const brands = await fetcher('/helpers/brand');

  return {
    props: {
      item: item.data,
      helpers: {
        brands: brands.data
      }
    }
  };
}

export default SupplierItem;
