import Router from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import { submitPayload, initialValues } from 'js/shapes/sales-report';
import validationSchema from 'js/validations/sales-report';

// components
import Layout from 'components/layout/layout';
import SalesReportForm from 'components/sales-report-form/sales-report-form';

const SalesReportAdd = ({ helpers }) => {
  const { notification } = useAppContext();

  const handleSubmit = async (values, actions) => {
    try {
      await fetcher('/sales-report', {
        method: 'POST',
        body: JSON.stringify(submitPayload(values))
      });

      actions.resetForm();
      Router.push('/sales-report');
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
      <Formik initialValues={initialValues} validationSchema={validationSchema}>
        <SalesReportForm helpers={helpers} onSubmit={handleSubmit} />
      </Formik>
    </Layout>
  );
};

export async function getStaticProps() {
  const paymentTypes = await fetcher('/helpers/payment-type');
  const banks = await fetcher('/helpers/bank');
  const salesTypes = await fetcher('/helpers/sales-type');
  const inventory = await fetcher('/helpers/inventory');

  return {
    props: {
      helpers: {
        inventory: safety(inventory, 'data', []),
        paymentTypes: safety(paymentTypes, 'data', []),
        banks: safety(banks, 'data', []),
        salesTypes: safety(salesTypes, 'data', [])
      }
    }
  };
}

export default SalesReportAdd;
