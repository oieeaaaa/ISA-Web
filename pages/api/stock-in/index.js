import omit from 'lodash.omit';
import prisma from 'prisma-client';
import api from 'js/utils/api';
import { connect, multiConnect } from 'js/shapes/prisma-query';
import { stockInAttributes } from 'js/shapes/stock-in';
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

      const supplierQuery = (supplier) => {
        if (!supplier) return {};

        return {
          supplier: {
            OR: toFullTextSearchQuery(['initials', 'vendors'], supplier)
          }
        };
      };

      const where = {
        OR: [
          ...toFullTextSearchQuery(
            [
              'referenceNumber',
              'remarks',
              'receivedBy',
              'checkedBy',
              'codedBy'
            ],
            search
          ),
          supplierQuery(search)
        ],
        AND: [
          ...toFilterQuery(omit(filters, ['supplier'])),
          supplierQuery(filters.supplier)
        ]
      };

      const items = await prisma.stockIn.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: direction
        },
        select: {
          ...omit(stockInAttributes, ['items', 'remarks']),
          supplierID: false,
          supplier: {
            select: {
              initials: true,
              vendor: true
            }
          }
        }
      });

      const { count: totalItems } = await prisma.stockIn.aggregate({
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

  // TODO: Handle Validation
  post: async (req, res) => {
    const { items, supplier, ...stockIn } = req.body;

    try {
      // then create the stockIn
      const createStockIn = prisma.stockIn.create({
        // StockIn
        data: {
          ...stockIn,
          supplier: connect(supplier),

          // Variants (many)
          items: multiConnect(items)
        }
      });

      // new items are incoming... so let's add 'em quantities!
      const incrementItemsQuantity = items.map(({ inventoryID, quantity }) =>
        prisma.inventory.update({
          where: { id: inventoryID },
          data: {
            quantity: {
              increment: Number(quantity)
            }
          }
        })
      );

      const result = await prisma.$transaction([
        createStockIn,
        ...incrementItemsQuantity
      ]);

      res.success(result);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
