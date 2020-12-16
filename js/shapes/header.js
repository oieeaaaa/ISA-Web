import { initialValues as profileInitialValues } from 'js/shapes/profile';
import { initialValues as settingsInitialValues } from 'js/shapes/settings';
import { initialValues as changePasswordInitialValues } from 'js/shapes/change-password';

import profileValidation from 'js/validations/profile';
import settingsValidation from 'js/validations/settings';
import changePasswordValidation from 'js/validations/change-password';

import Settings from 'components/settings/settings';
import Profile from 'components/profile/profile';
import ChangePassword from 'components/change-password/change-password';

export const menus = [
  {
    key: 'profile',
    label: 'Profile',
    modal: Profile,
    initialValues: profileInitialValues,
    validationSchema: profileValidation
  },
  {
    key: 'change-password',
    label: 'Change Password',
    modal: ChangePassword,
    initialValues: changePasswordInitialValues,
    validationSchema: changePasswordValidation
  },
  {
    key: 'settings',
    label: 'Settings',
    modal: Settings,
    initialValues: settingsInitialValues,
    validationSchema: settingsValidation
  }
];
