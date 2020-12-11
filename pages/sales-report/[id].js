import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import {
  editInitialPayload,
  editPayload,
  initialValues
} from 'js/shapes/sales-report';
import validationSchema from 'js/validations/sales-report';

// components
import Layout from 'components/layout/layout';
import SalesReportForm from 'components/sales-report-form/sales-report-form';

const SalesReportItem = ({ item, helpers }) => {
  const { notification } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      await fetcher(`/sales-report/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(editPayload(values))
      });

      notification.open({
        variant: 'success',
        message: messages.success.update
      });

      router.push('/sales-report');
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
          ...editInitialPayload(item)
        }}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}>
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
  const banks = await fetcher('/helpers/bank');
  const inventory = await fetcher('/helpers/inventory');

  return {
    props: {
      item: safety(item, 'data', {}),
      helpers: {
        inventory: safety(inventory, 'data', []),
        banks: safety(banks, 'data', [])
      }
    }
  };
}

export default SalesReportItem;
