import { useState } from 'react';
import fetcher from 'js/utils/fetcher';
import toParam from 'js/utils/toParam';
import Table from 'components/table/table';

const TableWithFetch = ({
  serverRoute,
  parameterizer, // cool name
  data,
  ...tableProps
}) => {
  const [tableData, setTableData] = useState(data);

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
        direction,
        search,
        page,
        limit: limit.value,
        sortBy: sortBy.key,
        ...parameterizer(configs)
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
      title="Inventory"
      icon="archive"
      data={tableData}
      onChange={handleFetch}
      {...tableProps}
    />
  );
};

export default TableWithFetch;
