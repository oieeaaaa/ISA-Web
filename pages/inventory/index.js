import fetcher from 'js/utils/fetcher';
import Layout from 'components/layout/layout';
import Table from 'components/table/table';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';

const Inventory = ({ data, helpers }) => (
  <Layout>
    <Table
      title="Inventory"
      icon="archive"
      headers={[{
        label: 'Reference No.',
        accessKey: 'referenceNumber',
      }, {
        label: 'Particular',
        accessKey: 'particular',
      }, {
        label: 'Codes',
        accessKey: 'codes',
      }, {
        label: 'Brand',
        accessKey: 'brand.name',
      }, {
        label: 'Supplier',
        accessKey: 'supplier.name',
      }, {
        label: 'Applications',
        accessKey: 'applications',
        customCell: ({ value }) => {
          const applicationNames = value.map((val) => val.name).join(', ');

          return <p>{applicationNames}</p>;
        },
      }]}
      data={data}
      filters={{
        owner: {},
        brand: {},
      }}
      sortOptions={[
        {
          id: 1,
          name: 'Reference No.',
        },
        {
          id: 2,
          name: 'Particular',
        },
      ]}
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
      onChange={console.log}
    />
  </Layout>
);

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
