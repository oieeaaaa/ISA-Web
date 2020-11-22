import fetcher from 'js/utils/fetcher';
import toStringifyDate from 'js/utils/toStringifyDate';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/inventory';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import DatePicker from 'components/date-picker/date-picker';

const Inventory = ({ data, helpers }) => {
  const parameterizer = ({ brand, dateReceived, referenceDate, supplier }) => ({
    'brand.id': brand.id,
    'supplier.id': supplier.id,
    dateReceived: toStringifyDate(dateReceived),
    referenceDate: toStringifyDate(referenceDate)
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="inventory"
        parameterizer={parameterizer}
        title="Inventory"
        icon="archive"
        headers={tableHeaders}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="inventory-filters">
            <InputGroup
              name="dateReceived"
              label="Date Received"
              component={DatePicker}
            />
            <InputGroup
              name="referenceDate"
              label="Reference Date"
              component={DatePicker}
            />
            <InputGroup
              name="brand"
              label="Brand"
              component={Select}
              options={helpers.brands}
              mainKey="name"
            />
            <InputGroup
              name="supplier"
              label="Supplier"
              component={Select}
              options={helpers.suppliers}
              mainKey="name"
            />
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const { data } = await fetcher('/inventory');
  const brands = await fetcher('/helpers/brand');
  const suppliers = await fetcher('/helpers/supplier');

  return {
    props: {
      data,
      helpers: {
        brands: brands.data,
        suppliers: suppliers.data
      }
    }
  };
}

export default Inventory;
