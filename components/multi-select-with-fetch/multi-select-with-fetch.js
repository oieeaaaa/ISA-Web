import { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';
import fetcher from 'js/utils/fetcher';
import MultiSelect from 'components/multi-select/multi-select';

const MultiSelectWithFetch = ({ serverRoute, initialOptions = [], ...etc }) => {
  const [options, setOptions] = useState(initialOptions);

  const handleSearch = throttle(async (query) => {
    const result = await fetcher(`${serverRoute}?search=${query}`);

    setOptions(result.data);
  }, 400);

  useEffect(() => {
    if (initialOptions.length) return;

    handleSearch('');
  }, []);

  return <MultiSelect onSearch={handleSearch} options={options} {...etc} />;
};

export default MultiSelectWithFetch;
