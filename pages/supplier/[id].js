import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import safety from 'js/utils/safety';
import { initialValues } from 'js/shapes/suppliers';
import validationSchema from 'js/validations/supplier';

// components
import Layout from 'components/layout/layout';
import SupplierForm from 'components/supplier-form/supplier-form';

const SupplierItem = ({ item, helpers }) => {
  const { notification } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      await fetcher(`/supplier/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      });

      notification.open({
        variant: 'success',
        message: 'Update saved'
      });
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.update
      });
    }
  };

  const handleDelete = async () => {
    try {
      await fetcher(`/supplier/${item.id}`, {
        method: 'DELETE'
      });

      notification.open({
        variant: 'success',
        message: 'Deleted supplier'
      });

      router.push('/supplier');
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.delete
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
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}>
        <SupplierForm
          mode="edit"
          helpers={helpers}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

  const item = await fetcher(`/supplier/${params.id}`);
  const brands = await fetcher('/helpers/brand');

  return {
    props: {
      item: safety(item, 'data', {}),
      helpers: {
        brands: safety(brands, 'data', [])
      }
    }
  };
}

export default SupplierItem;
