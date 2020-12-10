import prisma from 'prisma-client';
import api from 'js/utils/api';
import {
  multiCreate,
  multiConnectOrCreateByName
} from 'js/shapes/prisma-query';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

export default api({
  get: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        search,
        sortBy = 'dateCreated',
        direction = 'desc',
        ...filters
      } = req.query;

      const where = {
        AND: toFilterQuery(filters),
        OR: toFullTextSearchQuery(
          [
            'vendor',
            'initials',
            'owner',
            'tin',
            'representative',
            'address',
            'emails.some.email',
            'brands.some.name',
            'companyPhoneNumbers.some.phoneNumber',
            'representativePhoneNumbers.some.phoneNumber'
          ],
          search
        )
      };

      const items = await prisma.supplier.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: direction
        },
        include: {
          brands: true,
          representativePhoneNumbers: true,
          companyPhoneNumbers: true,
          emails: true
        }
      });

      const { count: totalItems } = await prisma.supplier.aggregate({
        where,
        count: true
      });

      res.success({
        items,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    const {
      brands,
      companyPhoneNumbers,
      representativePhoneNumbers,
      emails,
      ...payload
    } = req.body;

    try {
      const newItem = await prisma.supplier.create({
        data: {
          ...payload,
          brands: multiConnectOrCreateByName(brands),
          companyPhoneNumbers: multiCreate(companyPhoneNumbers),
          representativePhoneNumbers: multiCreate(representativePhoneNumbers),
          emails: multiCreate(emails)
        }
      });

      res.success(newItem);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
