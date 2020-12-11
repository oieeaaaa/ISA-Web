import { useRouter } from 'next/router';
import fetcher from 'js/utils/fetcher';
import toStringifyDate from 'js/utils/toStringifyDate';
import safety from 'js/utils/safety';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/purchase-order';

// components
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const PurchaseOrder = ({ data, helpers }) => {
  const router = useRouter();

  const parameterizer = ({ dateCreated, tracking, supplier }) => ({
    dateCreated_range: toStringifyDate(dateCreated),
    'supplier.id': supplier.id,
    'tracking.id': tracking.id
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="purchase-order"
        parameterizer={parameterizer}
        title="PO"
        icon="clipboard"
        headers={tableHeaders}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        onAdd={() => router.push('/purchase-order/add')}
        renderFilter={() => (
          <div className="purchase-order-filters">
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DateRangePicker}
            />
            <div className="purchase-order-filters__group  purchase-order-filters__group--select">
              <InputGroup
                name="supplier"
                label="Supplier"
                mainKey="initials"
                serverRoute="/helpers/supplier"
                initialOptions={helpers.suppliers}
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="tracking"
                label="Tracking"
                mainKey="address"
                serverRoute="/helpers/tracking"
                initialOptions={helpers.tracking}
                component={InputSelectWithFetch}
              />
            </div>
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const po = await fetcher('/purchase-order');

  // helpers
  const suppliers = await fetcher('/helpers/supplier');
  const tracking = await fetcher('/helpers/tracking');

  return {
    props: {
      data: safety(po, 'data', []),
      helpers: {
        suppliers: safety(suppliers, 'data', []),
        tracking: safety(tracking, 'data', [])
      }
    }
  };
}

export default PurchaseOrder;
