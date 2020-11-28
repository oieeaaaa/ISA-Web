import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';
import { connectOrCreateSingle } from 'js/utils/connectOrCreate';

const prisma = new PrismaClient();

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

      const query = {
        skip: (page - 1) * limit,
        orderBy: {
          [sortBy]: direction
        },
        where: {
          AND: toFilterQuery(filters),
          OR: toFullTextSearchQuery(
            ['supplier.initials', 'supplier.vendor'], // TODO: Figure out how will this behave
            search
          )
        },
        take: limit,
        include: {
          supplier: true,
          items: {
            include: {
              item: true
            }
          }
        }
      };

      const items = await prisma.purchaseOrder.findMany(query);
      const totalItems = await prisma.purchaseOrder.count();

      res.success({
        items,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    const { supplier, items, ...payload } = req.body;

    try {
      const result = await prisma.purchaseOrder.create({
        data: {
          ...payload,
          supplier: connectOrCreateSingle(supplier, 'id'),
          items: {
            create: items.map(({ id, quantity }) => ({
              quantity,
              item: {
                connect: {
                  id
                }
              }
            }))
          }
        }
      });

      res.success(result);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
