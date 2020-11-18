import { Formik } from 'formik';
import fetcher from 'js/utils/fetcher';
import { addPayload, initialValues } from 'js/shapes/inventoryPayload';
import Layout from 'components/layout/layout';
import InventoryForm from 'components/inventory-form/inventory-form';

const InventoryAdd = ({ helpers }) => {
  const handleSubmit = async (values) => {
    try {
      console.log(addPayload(values));
      const res = await fetcher('/inventory', {
        method: 'POST',
        body: JSON.stringify(addPayload(values)),
      });

      console.log({ res, values });
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: Validation
  return (
    <Layout>
      <Formik initialValues={initialValues}>
        {(formikProps) => (
          <InventoryForm
            helpers={helpers}
            formikProps={formikProps}
            onSubmit={handleSubmit}
          />
        )}
      </Formik>
    </Layout>
  );
};

export async function getStaticProps() {
  const uoms = await fetcher('/helpers/uom');
  const brands = await fetcher('/helpers/brand');
  const suppliers = await fetcher('/helpers/supplier');
  const applications = await fetcher('/helpers/application');
  const codes = await fetcher('/helpers/code');

  return {
    props: {
      helpers: {
        brands: brands.data,
        uoms: uoms.data,
        suppliers: suppliers.data,
        applications: applications.data,
        codes: codes.data,
      },
    },
  };
}

export default InventoryAdd;
