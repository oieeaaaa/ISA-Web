import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import {
  updatePayload,
  initialValues,
  toSoldItems
} from 'js/shapes/sales-report';
import validationSchema from 'js/validations/sales-report';

// components
import Layout from 'components/layout/layout';
import SalesReportForm from 'components/sales-report-form/sales-report-form';

const SalesReportItem = ({ item, helpers }) => {
  const { notification } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (values, actions) => {
    try {
      await fetcher(`/sales-report/${router.query.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload(values))
      });

      actions.resetForm();
      router.push('/sales-report');
      notification.open({
        variant: 'success',
        message: messages.success.update
      });
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.success.update
      });
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={{
          ...initialValues,
          ...item,
          soldItems: toSoldItems(item.soldItems)
        }}
        validationSchema={validationSchema}>
        <SalesReportForm
          mode="edit"
          helpers={helpers}
          onSubmit={handleSubmit}
        />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  const item = await fetcher(`/sales-report/${params.id}`);
  const paymentTypes = await fetcher('/helpers/payment-type');
  const banks = await fetcher('/helpers/bank');
  const salesTypes = await fetcher('/helpers/sales-type');
  const inventory = await fetcher('/helpers/inventory');

  return {
    props: {
      item: safety(item, 'data', {}),
      helpers: {
        inventory: safety(inventory, 'data', []),
        paymentTypes: safety(paymentTypes, 'data', []),
        banks: safety(banks, 'data', []),
        salesTypes: safety(salesTypes, 'data', [])
      }
    }
  };
}

export default SalesReportItem;
