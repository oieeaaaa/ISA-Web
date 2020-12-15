import { useRouter } from 'next/router';
import { Formik } from 'formik';
import messages from 'js/messages';
import safety from 'js/utils/safety';
import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import {
  editInitialPayload,
  editPayload,
  initialValues
} from 'js/shapes/stock-in';
import validationSchema from 'js/validations/stock-in';

// components
import Layout from 'components/layout/layout';
import StockInForm from 'components/stock-in-form/stock-in-form';

const StockInEdit = ({ data, helpers }) => {
  const { notification } = useAppContext();

  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      await fetcher(`/stock-in/${values.id}`, {
        method: 'PUT',
        body: JSON.stringify(editPayload(values))
      });

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

  const handleDelete = async () => {
    try {
      await fetcher(`/stock-in/${data.id}`, {
        method: 'DELETE'
      });

      notification.open({
        variant: 'success',
        message: 'Deleted stock in'
      });

      router.push('/stock-in');
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.delete
      });
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={{
          ...initialValues,
          ...editInitialPayload(data)
        }}
        validationSchema={validationSchema}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}>
        <StockInForm
          helpers={helpers}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          mode="edit"
        />
      </Formik>
    </Layout>
  );
};

export async function getServerSideProps({ params, req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

  const { data } = await fetcher(`/stock-in/${params.id}`);

  const suppliers = await fetcher('/helpers/supplier');
  const codedBy = await fetcher('/helpers/coded-by');
  const checkedBy = await fetcher('/helpers/checked-by');
  const receivedBy = await fetcher('/helpers/received-by');

  return {
    props: {
      data,
      helpers: {
        suppliers: safety(suppliers, 'data', []),
        codedBy: safety(codedBy, 'data', []),
        receivedBy: safety(receivedBy, 'data', []),
        checkedBy: safety(checkedBy, 'data', [])
      }
    }
  };
}

export default StockInEdit;
