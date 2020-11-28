import { Formik } from 'formik';
import fetcher from 'js/utils/fetcher';
import { initialValues, toItems } from 'js/shapes/purchase-order';
import validationSchema from 'js/validations/purchase-order';

// components
import Layout from 'components/layout/layout';
import SalesReportForm from 'components/purchase-order-form/purchase-order-form';

const PurchaseOrderDetail = ({ item }) => (
  <Layout>
    <Formik
      initialValues={{
        ...initialValues,
        ...item,
        items: toItems(item.items)
      }}
      validationSchema={validationSchema}>
      <SalesReportForm mode="view" helpers={{}} />
    </Formik>
  </Layout>
);

export async function getServerSideProps({ params }) {
  const item = await fetcher(`/purchase-order/${params.id}`);

  return {
    props: {
      item: item.data
    }
  };
}

export default PurchaseOrderDetail;
