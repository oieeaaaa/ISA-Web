import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import toStringifyDate from 'js/utils/toStringifyDate';
import goTo from 'js/utils/goTo';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions,
  types,
  paymentTypes
} from 'js/shapes/sales-report';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const SalesReport = ({ data, helpers }) => {
  const parameterizer = ({
    customer,
    dateCreated,
    salesStaff,
    type,
    paymentType
  }) => ({
    dateCreated_range: toStringifyDate(dateCreated),
    name: customer.name,
    type: type.name,
    paymentType: paymentType.name,
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
        onAdd={() => goTo('/sales-report/add')}
        renderFilter={() => (
          <div className="sales-report-filters">
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DateRangePicker}
            />
            <div className="sales-report-filters__types">
              <InputGroup
                name="customer"
                label="Customer"
                initialOptions={helpers.customers}
                serverRoute="/helpers/customer"
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="type"
                label="Type"
                component={Select}
                options={types}
                mainKey="name"
              />
              <InputGroup
                name="paymentType"
                label="Payment Type"
                component={Select}
                options={paymentTypes}
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
  const sp = await fetcher('/sales-report');

  // helpers
  const salesStaff = await fetcher('/helpers/sales-staff');
  const customers = await fetcher('/helpers/customer');

  return {
    props: {
      data: safety(sp, 'data', []),
      helpers: {
        salesStaff: safety(salesStaff, 'data', []),
        customers: safety(customers, 'data', [])
      }
    }
  };
}

export default SalesReport;
