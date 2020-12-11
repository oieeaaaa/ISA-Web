import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import toStringifyDate from 'js/utils/toStringifyDate';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions
} from 'js/shapes/suppliers';
import goTo from 'js/utils/goTo';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Input from 'components/input/input';
import DateRangePicker from 'components/date-range-picker/date-range-picker';

const Supplier = ({ data, helpers }) => {
  const parameterizer = ({ brand, entry, ...etc }) => ({
    ...etc,
    'brands.some.name': brand.name,
    entry_range: toStringifyDate(entry)
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="supplier"
        parameterizer={parameterizer}
        title="Suppliers"
        icon="list"
        headers={tableHeaders}
        data={data.items}
        totalItems={data.totalItems}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        onAdd={() => goTo('/supplier/add')}
        renderFilter={() => (
          <div className="supplier-filters">
            <InputGroup
              name="entry"
              label="Entry"
              component={DateRangePicker}
            />
            <div className="supplier-filters__group">
              <InputGroup
                name="brand"
                label="Brand"
                mainKey="name"
                serverRoute="/helpers/brand"
                initialOptions={helpers.suppliers}
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="terms"
                label="Terms (days)"
                type="number"
                component={Input}
              />
            </div>
          </div>
        )}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  const supplier = await fetcher('/supplier');
  const brands = await fetcher('/helpers/brand');

  return {
    props: {
      data: safety(supplier, 'data', []),
      helpers: {
        brands: safety(brands, 'data', [])
      }
    }
  };
}

export default Supplier;
