import useAppContext from 'js/contexts/app';
import fetcher from 'js/utils/fetcher';
import toStringifyDate from 'js/utils/toStringifyDate';
import safety from 'js/utils/safety';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/inventory';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const Inventory = ({ data, helpers }) => {
  const { codes } = useAppContext();

  const parameterizer = ({ brand, dateReceived, referenceDate, supplier }) => ({
    'brand.id': brand.id,
    'supplier.id': supplier.id,
    dateReceived_range: toStringifyDate(dateReceived),
    referenceDate_range: toStringifyDate(referenceDate)
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="inventory"
        parameterizer={parameterizer}
        title="Inventory"
        icon="archive"
        headers={tableHeaders({ codes })}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="inventory-filters">
            <InputGroup
              name="dateReceived"
              label="Date Received"
              component={DateRangePicker}
            />
            <InputGroup
              name="referenceDate"
              label="Reference Date"
              component={DateRangePicker}
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
              displayKey="initials"
            />
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const inventory = await fetcher('/inventory');
  const brands = await fetcher('/helpers/brand');
  const suppliers = await fetcher('/helpers/supplier');

  return {
    props: {
      data: safety(inventory, 'data', []),
      helpers: {
        brands: safety(brands, 'data', []),
        suppliers: safety(suppliers, 'data', [])
      }
    }
  };
}

export default Inventory;
