import { Formik } from 'formik';
import fetcher from 'js/utils/fetcher';
import Layout from 'components/layout/layout';
import InventoryForm from 'components/inventory-form/inventory-form';

// TODO:
// Find a way to disable the auto-submit on enter
const InventoryAdd = ({ helpers }) => {
  const handleSubmit = async (values) => {
    try {
      const {
        applications,
        codes,
        uom,
        brand,
        supplier,
        ...payload
      } = values;

      await fetcher('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          applications: {
            // TODO: create a shape for upsert
            upsert: {
              create: applications,
              update: applications,
            },
          },
          codes: {
            upsert: {
              create: codes,
              update: codes,
            },
          },
          uom: {
            upsert: {
              create: uom,
              update: uom,
            },
          },
          brand: {
            upsert: {
              create: brand,
              update: brand,
            },
          },
          supplier: {
            update: supplier,
          },
        }),
      });

      console.log(values);
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: Validation
  return (
    <Layout>
      <Formik
        initialValues={{
          dateReceived: new Date(),

          // reference
          referenceNumber: '',
          referenceDateReceived: new Date(),

          // details
          particular: '',
          partsNumber: '',
          size: '',
          quantity: 0,
          applications: [],
          brand: { name: '' },
          supplier: { id: null, name: '' },
          description: '',

          // pricing
          codes: [],
          uom: { name: '' },
          srp: '',

          // other info
          remarks: '',
          receivedBy: '',
          checkedBy: '',
          codedBy: '',
        }}
      >
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
