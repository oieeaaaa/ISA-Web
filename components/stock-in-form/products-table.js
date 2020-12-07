import { useState } from 'react';
import {
  tableHeaders,
  tableSortOptions,
  tableFilters
} from 'js/shapes/variant';
import fetcher from 'js/utils/fetcher';
import omitBy from 'lodash.omitby';
import toParam from 'js/utils/toParam';
import InputGroup from 'components/input-group/input-group';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Table from 'components/table/table';

const ProductsTable = ({ onCreateProduct, onClickProduct }) => {
  const [tableData, setTableData] = useState({ items: [], totalItems: 0 });

  const handleFetch = async ({
    limit,
    sortBy,
    direction,
    search,
    page,
    brand,
    size,
    supplier,
    inventory
  }) => {
    try {
      const param = toParam({
        search,
        ...omitBy(
          {
            direction,
            page,
            limit: limit.value,
            sortBy: sortBy.key,
            'brand.name': brand.name,
            'size.name': size.name,
            'supplier.initials': supplier.initials,
            'inventory.particular': inventory.particular
          },
          (val) => !val
        ) // omit falsy values
      });

      const url = `/helpers/variant?${param}`;
      const { data } = await fetcher(url);

      setTableData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="stock-in-form__table">
      <Table
        title="Products"
        icon="archive"
        headers={tableHeaders}
        filters={tableFilters}
        sortOptions={tableSortOptions}
        data={tableData.items}
        totalItems={tableData.totalItems}
        onChange={handleFetch}
        onRowClick={onClickProduct}
        onAdd={onCreateProduct}
        renderFilter={() => (
          <div className="stock-in-form__table-filters">
            <InputGroup
              name="supplier"
              label="Supplier"
              mainKey="initials"
              serverRoute="/helpers/supplier"
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="inventory"
              label="Particular"
              mainKey="particular"
              serverRoute="/helpers/inventory"
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="size"
              label="Size"
              serverRoute="/helpers/size"
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="brand"
              label="Brand"
              serverRoute="/helpers/brand"
              component={InputSelectWithFetch}
            />
          </div>
        )}
      />
    </div>
  );
};

export default ProductsTable;
