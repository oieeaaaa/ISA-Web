import prisma from 'prisma-client';
import omit from 'lodash.omit';
import api from 'js/utils/api';
import { safeType } from 'js/utils/safety';
import codeCalc from 'js/utils/codeCalc';
import { connect, select } from 'js/shapes/prisma-query';
import { variantAttributes } from 'js/shapes/variant';

export default api({
  get: async (req, res) => {
    try {
      const { id } = req.query;

      let stockIn = await prisma.stockIn.findOne({
        where: { id },
        include: {
          supplier: select(['id', 'initials', 'vendor']),
          items: {
            include: {
              item: {
                select: {
                  ...variantAttributes,
                  supplier: select(['id', 'initials', 'vendor']),
                  inventory: select([
                    'id',
                    'quantity',
                    'particular',
                    'partsNumber',
                    'uom'
                  ])
                }
              }
            }
          }
        }
      });

      const codes = await prisma.code.findMany({});

      stockIn = {
        ...stockIn,
        items: stockIn.items.map((item) => ({
          ...item,
          item: {
            ...item.item,
            unitCost: codeCalc(codes, item.item?.codes)
          }
        }))
      };

      res.success(stockIn);
    } catch (error) {
      res.error(error);
    }
  },

  // TODO: Handle Validation
  put: async (req, res) => {
    const { id, removedItems, items, supplier, ...stockIn } = req.body;

    try {
      // then create the stockIn
      const updateStockIn = prisma.stockIn.update({
        // StockIn
        where: { id },
        data: {
          ...omit(stockIn, ['supplierID', 'variantId']),
          supplier: connect(supplier),
          items: {
            disconnect: removedItems.map(({ itemID }) => ({
              id: safeType.string(itemID)
            })),
            upsert: items.map(({ itemID, variantID, quantity }) => ({
              where: {
                id: safeType.string(itemID)
              },
              update: {
                quantity
              },
              create: {
                quantity,
                item: {
                  connect: {
                    id: safeType.string(variantID)
                  }
                }
              }
            }))
          }
        }
      });

      const updateItemsQuantity = items.map(
        ({ inventoryID, prevQty, quantity }) =>
          prisma.inventory.update({
            where: { id: inventoryID },
            data: {
              quantity: {
                decrement: quantity - safeType.number(prevQty)
              }
            }
          })
      );

      const putBackRemovedItemsQuantity = removedItems.length
        ? removedItems.map(({ inventoryID, quantity }) =>
            prisma.inventory.update({
              where: { id: inventoryID },
              data: {
                quantity: {
                  decrement: quantity
                }
              }
            })
          )
        : [];

      const result = await prisma.$transaction([
        updateStockIn,
        ...putBackRemovedItemsQuantity,
        ...updateItemsQuantity
      ]);

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  delete: async (req, res) => {
    const { id } = req.query;

    try {
      const result = await prisma.stockIn.delete({
        where: { id }
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
});
