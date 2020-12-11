import { Formik } from 'formik';
import {
  addedItemsHeaders,
  initialValues,
  toItems
} from 'js/shapes/purchase-order';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import dateFormat from 'js/utils/dateFormat';
import goTo from 'js/utils/goTo';

// components
import Layout from 'components/layout/layout';
import InputGroup from 'components/input-group/input-group';
import InputDisplay from 'components/input-display/input-display';
import FormActions from 'components/form-actions/form-actions';
import Button from 'components/button/button';
import TableContainer from 'components/table/table-container';

const PurchaseOrderDetail = ({ item }) => (
  <Layout>
    <Formik
      initialValues={{
        ...initialValues,
        ...item
      }}>
      <div className="purchase-order-detail">
        <FormActions icon="clipboard" title="View purchase order">
          <Button onClick={() => goTo('/purchase-order')}>Go back</Button>
          <Button onClick={() => {}} variant="primary">
            Download PO
          </Button>
        </FormActions>
        <div className="purchase-order-detail-container purchase-order-detail__head">
          <InputGroup
            name="dateCreated"
            label="Date Created"
            component={InputDisplay}
            formatVal={dateFormat}
          />
          <InputGroup
            name="supplier"
            label="Supplier"
            component={InputDisplay}
            formatVal={(val) =>
              val ? `(${val.initials}) ${val.vendor}` : 'N/A'
            }
          />
          <InputGroup
            name="tracking.address"
            label="Tracking"
            component={InputDisplay}
          />
        </div>
        <div className="purchase-order-detail-container purchase-order-detail__items">
          <TableContainer
            headers={addedItemsHeaders}
            data={toItems(item.items)}
          />
        </div>
      </div>
    </Formik>
  </Layout>
);

export async function getServerSideProps({ params }) {
  const item = await fetcher(`/purchase-order/${params.id}`);

  return {
    props: {
      item: safety(item, 'data', {})
    }
  };
}

export default PurchaseOrderDetail;
