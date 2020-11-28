import { useState } from 'react';
import throttle from 'lodash.throttle';
import fetcher from 'js/utils/fetcher';
import InputSelect from 'components/input-select/input-select';
import toParam from 'js/utils/toParam';

const InputSelectWithFetch = ({
  filters,
  serverRoute,
  initialOptions,
  ...etc
}) => {
  const [options, setOptions] = useState(initialOptions);

  const handleSearch = throttle(async (search) => {
    const params = toParam({
      search,
      ...filters
    });

    const result = await fetcher(`${serverRoute}?${params}`);

    setOptions(result.data);
  }, 400);

  return <InputSelect onSearch={handleSearch} options={options} {...etc} />;
};

export default InputSelectWithFetch;
