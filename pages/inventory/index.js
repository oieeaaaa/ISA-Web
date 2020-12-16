import fetcher from 'js/utils/fetcher';
import verifyLogin from 'js/utils/verifyLogin';
import toStringifyDate from 'js/utils/toStringifyDate';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/inventory';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const Inventory = ({ data, helpers }) => {
  const parameterizer = ({ brands, dateCreated, suppliers }) => ({
    'suppliers_multiple.id': suppliers.map(({ id }) => id).join(','),
    'brands_multiple.id': brands.map(({ id }) => id).join(','),
    dateCreated_range: toStringifyDate(dateCreated)
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
        onAdd={() => goTo('/inventory/add')}
        renderFilter={() => (
          <div className="inventory-filters">
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DateRangePicker}
            />
            <InputGroup
              name="brands"
              label="Brands"
              initialOptions={helpers.brands}
              serverRoute="/helpers/brand"
              component={MultiSelectWithFetch}
              noCreate
            />
            <InputGroup
              name="suppliers"
              label="Suppliers"
              initialOptions={helpers.suppliers}
              serverRoute="/helpers/supplier"
              component={MultiSelectWithFetch}
              mainKey="initials"
              noCreate
            />
          </div>
        )}
      />
    </Layout>
  );
};

export async function getServerSideProps({ req, res }) {
  if (!verifyLogin(req, res)) return { props: {} };

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
