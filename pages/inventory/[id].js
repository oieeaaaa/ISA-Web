import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
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

      router.push('/inventory');
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
        <InventoryForm mode="edit" helpers={helpers} />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const item = await fetcher(`/inventory/${params.id}`);

  // TODO: Make helpers relative to the current item's values
  const uoms = await fetcher('/helpers/uom');
  const brands = await fetcher('/helpers/brand');
  const suppliers = await fetcher('/helpers/supplier');
  const applications = await fetcher('/helpers/application');

  return {
    props: {
      item: safety(item, 'data', {}),
      helpers: {
        uoms: safety(uoms, 'data', []),
        brands: safety(brands, 'data', []),
        suppliers: safety(suppliers, 'data', []),
        applications: safety(applications, 'data', [])
      }
    }
  };
}

export default InventoryItem;
