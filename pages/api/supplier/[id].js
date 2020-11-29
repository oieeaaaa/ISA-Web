import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';
import { disconnectMultiple } from 'js/utils/disconnect';
import { connectOrCreateMultiple } from 'js/utils/connectOrCreate';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const item = await prisma.supplier.findOne({
        where: {
          id: req.query.id
        },
        include: {
          brands: true,
          representativePhoneNumbers: true,
          companyPhoneNumbers: true,
          emails: true
        }
      });

      res.success(item);
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
            ...connectOrCreateMultiple(brands)
          },
          companyPhoneNumbers: {
            ...disconnectMultiple(companyPhoneNumbersX),
            ...connectOrCreateMultiple(companyPhoneNumbers, 'phoneNumber', 'id')
          },
          representativePhoneNumbers: {
            ...disconnectMultiple(representativePhoneNumbersX),
            ...connectOrCreateMultiple(
              representativePhoneNumbers,
              'phoneNumber',
              'id'
            )
          },
          emails: {
            ...disconnectMultiple(emailsX),
            ...connectOrCreateMultiple(emails, 'email', 'id')
          }
        }
      });

      res.success(updatedItem);
    } catch (error) {
      res.error(error);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedItem = await prisma.supplier.delete({
        where: {
          id: req.query.id
        }
      });

      res.success(deletedItem);
    } catch (error) {
      res.error(error);
    }
  }
});
