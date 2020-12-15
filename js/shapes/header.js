import Settings from 'components/settings/settings';
import Profile from 'components/profile/profile';

export const initialValues = {
  codes: [],
  removedCodes: [],
  user: {}
};

export const menus = [
  {
    key: 'profile',
    label: 'Profile',
    modal: Profile
  },
  {
    key: 'settings',
    label: 'Settings',
    modal: Settings
  }
];
