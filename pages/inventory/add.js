import Router from 'next/router';
import { Formik } from 'formik';
import fetcher from 'js/utils/fetcher';
import { addPayload, initialValues } from 'js/shapes/inventory';
import validationSchema from 'js/validations/inventory';

// components
import Layout from 'components/layout/layout';
import InventoryForm from 'components/inventory-form/inventory-form';

const InventoryAdd = ({ helpers }) => {
  const handleSubmit = async (values, actions) => {
    try {
      await fetcher('/inventory', {
        method: 'POST',
        body: JSON.stringify(addPayload(values))
      });

      actions.resetForm();
      Router.push('/inventory');
    } catch (error) {
      // TODO: Display notification so that the user can see
      console.error(error);
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        <InventoryForm helpers={helpers} />
      </Formik>
    </Layout>
  );
};

export async function getStaticProps() {
  const uoms = await fetcher('/helpers/uom');
  const brands = await fetcher('/helpers/brand');
  const suppliers = await fetcher('/helpers/supplier');
  const applications = await fetcher('/helpers/application');

  return {
    props: {
      helpers: {
        brands: brands.data,
        uoms: uoms.data,
        suppliers: suppliers.data,
        applications: applications.data
      }
    }
  };
}

export default InventoryAdd;
