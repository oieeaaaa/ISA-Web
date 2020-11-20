import fetcher from 'js/utils/fetcher';
import {
  tableHeaders,
  tableFilters,
  tableSortOptions,
} from 'js/shapes/inventory';
import Layout from 'components/layout/layout';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';

const Inventory = ({ data, helpers }) => {
  const parameterizer = (params) => ({
    brand: params.brand.id,
    owner: params.owner.id,
  });

  return (
    <Layout>
      <TableWithFetch
        serverRoute="inventory"
        parameterizer={parameterizer}
        title="Inventory"
        icon="archive"
        headers={tableHeaders}
        data={data}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        renderFilter={() => (
          <div className="inventory-filters">
            <InputGroup
              name="owner"
              label="Owner"
              component={Select}
              options={[]}
            />
            <InputGroup
              name="brand"
              label="Brand"
              component={Select}
              options={helpers.brands}
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

  return ({
    props: {
      data,
      helpers: {
        brands: brands.data,
      },
    },
  });
}

export default Inventory;
