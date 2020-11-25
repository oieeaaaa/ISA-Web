import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';
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
        sortBy = 'name',
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
            [
              'name',
              'tin',
              'siNumber',
              'arsNumber',
              'drNumber',
              'crsNumber',
              'address'
            ],
            search
          )
        },
        take: limit,
        include: {
          salesStaff: true,
          paymentType: true,
          bank: true,
          type: true,
          soldItems: true
        }
      };

      const items = await prisma.salesReport.findMany(query);
      const totalItems = await prisma.salesReport.count();

      res.success({
        items,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    try {
      const newItem = await prisma.salesReport.create({
        data: req.body
      });

      res.success(newItem);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
