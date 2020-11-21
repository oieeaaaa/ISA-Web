import { useRouter } from 'next/router';
import { Formik } from 'formik';
import omit from 'lodash.omit';
import fetcher from 'js/utils/fetcher';
import { submitPayload, initialValues } from 'js/shapes/inventory';
import validationSchema from 'js/validations/inventory';

// components
import Layout from 'components/layout/layout';
import InventoryForm from 'components/inventory-form/inventory-form';

const InventoryItem = ({ item, helpers }) => {
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      const updatedItem = await fetcher(`/inventory/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(
          omit(submitPayload(values), [
            'uomID',
            'supplierID',
            'brandID',
            'codeId'
          ])
        )
      });

      console.log(updatedItem);
    } catch (error) {
      // TODO: Display notification so that the user can see
      console.error(error.message);
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

// TODO: Make it relative to the current item's values
export async function getServerSideProps({ params }) {
  const item = await fetcher(`/inventory/${params.id}`);

  // helpers
  const uoms = await fetcher('/helpers/uom');
  const brands = await fetcher('/helpers/brand');
  const suppliers = await fetcher('/helpers/supplier');
  const applications = await fetcher('/helpers/application');

  return {
    props: {
      item: item.data,
      helpers: {
        brands: brands.data,
        uoms: uoms.data,
        suppliers: suppliers.data,
        applications: applications.data
      }
    }
  };
}

export default InventoryItem;
