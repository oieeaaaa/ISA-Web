import api from 'js/utils/api';
import commonGetHelper from 'js/utils/commonGetHelper';

export default api({
  get: commonGetHelper('supplier', {
    id: true,
    vendor: true,
    initials: true
  })
});
