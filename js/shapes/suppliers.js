export const tableHeaders = [
  {
    label: 'Initials',
    accessKey: 'initials'
  },
  {
    label: 'Vendor',
    accessKey: 'vendor'
  },
  {
    label: 'Terms',
    accessKey: 'terms'
  },
  {
    label: 'Address',
    accessKey: 'address'
  },
  {
    label: 'Parts No.',
    accessKey: 'Parts Number'
  },
  {
    label: 'Tin',
    accessKey: 'tin'
  },
  {
    label: 'Owner',
    accessKey: 'owner'
  },
  {
    label: 'Representative',
    accessKey: 'representative'
  },
  {
    label: 'Brand',
    accessKey: 'brands',
    customCell: ({ value }) => { // eslint-disable-line
      const brands = value.map((val) => val.name).join(', ');

      return <p>{brands}</p>;
    }
  },
  {
    label: 'Representative Phone Numbers',
    accessKey: 'representativePhoneNumbers',
    customCell: ({ value }) => { // eslint-disable-line
      const representativePhoneNumbers = value
        .map((val) => val.phoneNumber)
        .join(', ');

      return <p>{representativePhoneNumbers}</p>;
    }
  },
  {
    label: 'Company Phone Numbers',
    accessKey: 'companyPhoneNumbers',
    customCell: ({ value }) => { // eslint-disable-line
      const companyPhoneNumbers = value
        .map((val) => val.phoneNumber)
        .join(', ');

      return <p>{companyPhoneNumbers}</p>;
    }
  },
  {
    label: 'Emails',
    accessKey: 'emails',
    customCell: ({ value }) => { // eslint-disable-line
      const emails = value.map((val) => val.email).join(', ');

      return <p>{emails}</p>;
    }
  }
];

export const tableFilters = {
  entry_range: [],
  brand: {},
  terms: 0
};

export const tableSortOptions = [
  {
    name: 'Initials',
    key: 'initials'
  },
  {
    name: 'Vendor',
    key: 'vendor'
  },
  {
    name: 'Terms',
    key: 'terms'
  },
  {
    name: 'Address',
    key: 'address'
  },
  {
    name: 'Parts No.',
    key: 'Parts Number'
  },
  {
    name: 'Tin',
    key: 'tin'
  },
  {
    name: 'Owner',
    key: 'owner'
  },
  {
    name: 'Representative',
    key: 'representative'
  },
  {
    name: 'Brand',
    key: 'brands'
  },
  {
    name: 'Representative Phone Numbers',
    key: 'representativePhoneNumbers'
  },
  {
    name: 'Company Phone Numbers',
    key: 'companyPhoneNumbers'
  },
  {
    name: 'Emails',
    key: 'emails'
  }
];

export const initialValues = {
  vendor: '',
  entry: new Date(),
  initials: '',
  terms: 0,
  owner: '',
  tin: '',
  representative: '',
  address: '',
  brands: [],
  inventory: [],
  companyPhoneNumbers: [],
  representativePhoneNumbers: [],
  emails: []
};

export default {
  initialValues,
  tableHeaders,
  tableSortOptions,
  tableFilters
};
