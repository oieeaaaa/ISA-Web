import useAppContext from 'js/contexts/app';
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
import Select from 'components/select/select';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const PurchaseOrder = ({ data, helpers }) => {
  const { codes } = useAppContext();

  const parameterizer = ({ dateCreated, supplier }) => ({
    dateCreated_range: toStringifyDate(dateCreated),
    'supplier.id': supplier.id
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="purchase-order"
        parameterizer={parameterizer}
        title="PO"
        icon="clipboard"
        headers={tableHeaders(codes)}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="purchase-order-filters">
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DateRangePicker}
            />
            <InputGroup
              name="supplier"
              label="Supplier"
              component={Select}
              options={helpers.suppliers}
              mainKey="id"
              displayKey="initials"
            />
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

  return {
    props: {
      data: safety(po, 'data', []),
      helpers: {
        suppliers: safety(suppliers, 'data', [])
      }
    }
  };
}

export default PurchaseOrder;
