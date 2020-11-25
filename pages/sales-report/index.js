import fetcher from 'js/utils/fetcher';
import toStringifyDate from 'js/utils/toStringifyDate';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/sales-report';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const SalesReport = ({ data, helpers }) => {
  const parameterizer = ({ dateCreated, type, salesStaff }) => ({
    dateCreated_range: toStringifyDate(dateCreated),
    typeID: type.id,
    'salesStaff_multiple.id': salesStaff.map(({ id }) => id).join(',')
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="sales-report"
        parameterizer={parameterizer}
        title="Sales Report"
        icon="activity"
        headers={tableHeaders}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="sales-report-filters">
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DateRangePicker}
            />
            <div className="sales-report-filters__group">
              <InputGroup
                name="type"
                label="Type"
                component={Select}
                options={helpers.salesType}
                mainKey="name"
              />
              <InputGroup
                name="salesStaff"
                label="Sales Staff"
                initialOptions={helpers.salesStaff}
                serverRoute="/helpers/sales-staff"
                component={MultiSelectWithFetch}
                noCreate
              />
            </div>
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const { data } = await fetcher('/sales-report');

  // helpers
  const salesType = await fetcher('/helpers/sales-type');
  const salesStaff = await fetcher('/helpers/sales-staff');

  return {
    props: {
      data,
      helpers: {
        salesType: salesType.data,
        salesStaff: salesStaff.data
      }
    }
  };
}

export default SalesReport;
