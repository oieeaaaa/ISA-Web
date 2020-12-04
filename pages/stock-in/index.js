import fetcher from 'js/utils/fetcher';
import toStringifyDate from 'js/utils/toStringifyDate';
import safety from 'js/utils/safety';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/stock-in';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const StockIn = ({ data, helpers }) => {
  const parameterizer = ({
    dateCreated,
    referenceDate,
    supplier,
    codedBy,
    checkedBy,
    receivedBy,
    ...rest
  }) => ({
    ...rest,
    supplier: supplier.initials,
    codedBy: safety(codedBy, 'codedBy', ''),
    checkedBy: safety(checkedBy, 'checkedBy', ''),
    receivedBy: safety(receivedBy, 'receivedBy', ''),
    dateCreated_range: toStringifyDate(dateCreated),
    referenceDate_range: toStringifyDate(referenceDate)
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="stock-in"
        parameterizer={parameterizer}
        title="Stock In"
        icon="inbox"
        headers={tableHeaders}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="stock-in-filters">
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DateRangePicker}
            />
            <InputGroup
              name="referenceDate"
              label="Reference Date"
              component={DateRangePicker}
            />
            <InputGroup
              name="supplier"
              label="Supplier"
              mainKey="initials"
              serverRoute="/helpers/supplier"
              initialOptions={helpers.suppliers}
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="receivedBy"
              label="Received By"
              mainKey="receivedBy"
              serverRoute="/helpers/received-by"
              initialOptions={helpers.receivedBy}
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="checkedBy"
              label="Checked By"
              mainKey="checkedBy"
              serverRoute="/helpers/checked-by"
              initialOptions={helpers.checkedBy}
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="codedBy"
              label="Coded By"
              mainKey="codedBy"
              serverRoute="/helpers/coded-by"
              initialOptions={helpers.codedBy}
              component={InputSelectWithFetch}
            />
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const stockIn = await fetcher('/stock-in');

  // helpers
  const suppliers = await fetcher('/helpers/supplier');
  const codedBy = await fetcher('/helpers/coded-by');
  const checkedBy = await fetcher('/helpers/checked-by');
  const receivedBy = await fetcher('/helpers/received-by');

  return {
    props: {
      data: safety(stockIn, 'data', []),
      helpers: {
        suppliers: safety(suppliers, 'data', []),
        codedBy: safety(codedBy, 'data', []),
        receivedBy: safety(receivedBy, 'data', []),
        checkedBy: safety(checkedBy, 'data', [])
      }
    }
  };
}

export default StockIn;
