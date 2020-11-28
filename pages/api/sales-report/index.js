import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';
import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';

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
          soldItems: {
            include: {
              item: true
            }
          }
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
    const {
      type,
      paymentType,
      bank,
      salesStaff,
      soldItems,
      ...payload
    } = req.body;

    try {
      const createSalesReport = prisma.salesReport.create({
        data: {
          ...payload,
          type: connectOrCreateSingle(type),
          paymentType: connectOrCreateSingle(paymentType),
          bank: connectOrCreateSingle(bank),
          salesStaff: connectOrCreateMultiple(salesStaff),
          soldItems: {
            create: soldItems.map(({ id, selectedQuantity }) => ({
              quantity: selectedQuantity,
              item: {
                connect: {
                  id
                }
              }
            }))
          }
        }
      });

      // this is freakin' awesome
      // TODO:
      // Find a way to do this the DB way
      const multiUpdateInventoryItemQuantity = soldItems.map(
        ({ id, selectedQuantity }) =>
          prisma.inventory.update({
            where: { id },
            data: {
              quantity: {
                decrement: selectedQuantity
              }
            }
          })
      );

      await prisma.$transaction([
        createSalesReport,
        ...multiUpdateInventoryItemQuantity
      ]);

      res.success();
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
