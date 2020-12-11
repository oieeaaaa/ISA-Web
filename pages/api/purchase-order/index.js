import prisma from 'prisma-client';
import { connect, connectOrCreate, select } from 'js/shapes/prisma-query';
import api from 'js/utils/api';
import safety from 'js/utils/safety';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';
import codeCalc from 'js/utils/codeCalc';

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
            'supplier.OR[0].initials',
            'supplier.OR[1].vendor',
            'tracking.address'
          ],
          search
        )
      };

      const query = {
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          [sortBy]: direction
        },
        include: {
          tracking: true,
          supplier: select(['initials', 'vendor']),
          items: {
            include: {
              item: {
                select: {
                  id: true,
                  name: true,
                  dateCreated: true,
                  codes: true,
                  inventory: select(['id', 'quantity'])
                }
              }
            }
          }
        }
      };

      // source
      let purchaseOrders = await prisma.purchaseOrder.findMany(query);

      // to convert item's codes values
      const codes = await prisma.code.findMany({});

      // remapping result
      purchaseOrders = purchaseOrders.map(({ items, ...purchaseOrder }) => ({
        ...purchaseOrder,
        items,

        // aggregate item's cost
        grandTotal: items.reduce(
          (grandTotal, item) =>
            (grandTotal +=
              codeCalc(codes, safety(item, 'item.codes', '')) * item.quantity),
          0
        ),

        // aggregate item's quantity
        totalQuantity: items.reduce(
          (totalQuantity, item) => (totalQuantity += item.quantity),
          0
        )
      }));

      const { count: totalItems } = await prisma.purchaseOrder.aggregate({
        where,
        count: true
      });

      res.success({
        items: purchaseOrders,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    const { tracking, supplier, items, ...payload } = req.body;

    try {
      const result = await prisma.purchaseOrder.create({
        data: {
          ...payload,
          supplier: connect(supplier),
          tracking: connectOrCreate(tracking),
          items: {
            create: items.map(({ quantity, ...item }) => ({
              quantity,
              item: connect(item)
            }))
          }
        }
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
});
