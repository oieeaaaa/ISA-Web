import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';
import { connectOrCreateMultiple } from 'js/utils/connectOrCreate';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        search,
        sortBy = 'vendor',
        direction = 'desc',
        ...filters
      } = req.query;

      const query = {
        skip: (page - 1) * limit,
        orderBy: {
          [sortBy]: direction
        },
        where: {
          AND: toFilterQuery(filters),
          OR: toFullTextSearchQuery(
            ['vendor', 'initials', 'owner', 'tin', 'representative', 'address'],
            search
          )
        },
        take: limit,
        include: {
          brands: true,
          representativePhoneNumbers: true,
          companyPhoneNumbers: true,
          emails: true
        }
      };

      const items = await prisma.supplier.findMany(query);
      const totalItems = await prisma.supplier.count();

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
          brands: connectOrCreateMultiple(brands),
          companyPhoneNumbers: connectOrCreateMultiple(
            companyPhoneNumbers,
            'phoneNumber'
          ),
          representativePhoneNumbers: connectOrCreateMultiple(
            representativePhoneNumbers,
            'phoneNumber'
          ),
          emails: connectOrCreateMultiple(emails, 'email')
        }
      });

      res.success(newItem);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
