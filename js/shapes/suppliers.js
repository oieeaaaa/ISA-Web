import dateFormat from 'js/utils/dateFormat';

export const tableHeaders = [
  {
    label: 'Entry',
    accessKey: 'entry',
    customCell: ({ value }) => <p>{dateFormat(value)}</p> // eslint-disable-line
  },
  {
    label: 'Initials',
    accessKey: 'initials'
  },
  {
    label: 'Vendor',
    accessKey: 'vendor'
  },
  {
    label: 'Terms (days)',
    accessKey: 'terms'
  },
  {
    label: 'Address',
    accessKey: 'address'
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
    label: 'Brands',
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
  entry: [],
  brand: { name: '' },
  terms: 0
};

export const tableSortOptions = [
  {
    name: 'Date Created',
    key: 'dateCreated'
  },
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
