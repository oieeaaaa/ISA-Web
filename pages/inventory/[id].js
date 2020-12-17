import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import safety from 'js/utils/safety';
import { initialValues } from 'js/shapes/inventory';
import validationSchema from 'js/validations/inventory';

// components
import Layout from 'components/layout/layout';
import InventoryForm from 'components/inventory-form/inventory-form';

const InventoryItem = ({ item, helpers }) => {
  const router = useRouter();
  const { notification } = useAppContext();

  const handleSubmit = async (values) => {
    try {
      await fetcher(`/inventory/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      });

      notification.open({
        variant: 'success',
        message: 'Updated inventory!'
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
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}>
        <InventoryForm helpers={helpers} onSubmit={handleSubmit} />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

  const item = await fetcher(`/inventory/${params.id}`);
  const uoms = await fetcher('/helpers/uom');
  const applications = await fetcher('/helpers/application');

  return {
    props: {
      item: safety(item, 'data', {}),
      helpers: {
        uoms: safety(uoms, 'data', []),
        applications: safety(applications, 'data', [])
      }
    }
  };
}

export default InventoryItem;
