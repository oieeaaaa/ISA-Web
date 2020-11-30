import Router from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import safety from 'js/utils/safety';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import { initialValues } from 'js/shapes/inventory';
import validationSchema from 'js/validations/inventory';

// components
import Layout from 'components/layout/layout';
import InventoryForm from 'components/inventory-form/inventory-form';

const InventoryAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values, actions) => {
    try {
      await fetcher('/inventory', {
        method: 'POST',
        body: JSON.stringify(values)
      });

      actions.resetForm();
      Router.push('/inventory');
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
        uoms: safety(uoms, 'data', []),
        brands: safety(brands, 'data', []),
        suppliers: safety(suppliers, 'data', []),
        applications: safety(applications, 'data', [])
      }
    }
  };
}

export default InventoryAdd;
