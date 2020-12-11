import prisma from 'prisma-client';
import api from 'js/utils/api';
import { disconnectMultiple } from 'js/utils/disconnect';
import {
  multiConnectOrCreateByName,
  multiConnectOrCreate,
  select
} from 'js/shapes/prisma-query';

export default api({
  get: async (req, res) => {
    try {
      const result = await prisma.supplier.findOne({
        where: {
          id: req.query.id
        },
        include: {
          brands: select(['id', 'name']),
          representativePhoneNumbers: true,
          companyPhoneNumbers: true,
          emails: true
        }
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    const {
      brands,
      brandsX,
      companyPhoneNumbers,
      companyPhoneNumbersX,
      representativePhoneNumbers,
      representativePhoneNumbersX,
      emails,
      emailsX,
      ...payload
    } = req.body;

    try {
      const updatedItem = await prisma.supplier.update({
        where: {
          id: req.query.id
        },
        data: {
          ...payload,
          brands: {
            ...disconnectMultiple(brandsX),
            ...multiConnectOrCreateByName(brands)
          },
          companyPhoneNumbers: {
            ...disconnectMultiple(companyPhoneNumbersX),
            ...multiConnectOrCreate(companyPhoneNumbers)
          },
          representativePhoneNumbers: {
            ...disconnectMultiple(representativePhoneNumbersX),
            ...multiConnectOrCreate(representativePhoneNumbers)
          },
          emails: {
            ...disconnectMultiple(emailsX),
            ...multiConnectOrCreate(emails)
          }
        }
      });

      res.success(updatedItem);
    } catch (error) {
      res.error(error);
    }
  },
  delete: async (req, res) => {
    const { id } = req.query;

    try {
      const result = await prisma.supplier.delete({
        where: { id },
        include: {
          brands: true,
          items: true,
          purchaseOrders: true
        }
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
});
