import { useState } from 'react';
import omitBy from 'lodash.omitby';
import fetcher from 'js/utils/fetcher';
import toParam from 'js/utils/toParam';
import Table from 'components/table/table';

const TableWithFetch = ({
  serverRoute,
  parameterizer, // cool name
  data,
  totalItems,
  ...tableProps
}) => {
  const [tableData, setTableData] = useState({ items: data, totalItems });

  const handleFetch = async ({
    limit,
    sortBy,
    direction,
    search,
    page,
    ...configs
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
            ...parameterizer(configs)
          },
          (val) => !val
        ) // omit falsy values
      });

      const url = `/${serverRoute}?${param}`;
      const result = await fetcher(url);

      setTableData(result.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Table
      data={tableData.items}
      totalItems={tableData.totalItems}
      onChange={handleFetch}
      {...tableProps}
    />
  );
};

export default TableWithFetch;
