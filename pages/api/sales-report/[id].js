import prisma from 'prisma-client';
import omit from 'lodash.omit';
import { select } from 'js/shapes/prisma-query';
import { variantAttributes } from 'js/shapes/variant';
import { safeType } from 'js/utils/safety';
import api from 'js/utils/api';
import { disconnectMultiple } from 'js/utils/disconnect';
import {
  multiConnectOrCreateByName,
  connectOrCreate
} from 'js/shapes/prisma-query';
import { disconnectSingle } from 'js/utils/disconnect';

export default api({
  get: async (req, res) => {
    try {
      const salesReport = await prisma.salesReport.findOne({
        where: {
          id: req.query.id
        },
        include: {
          salesStaff: true,
          bank: true,
          soldItems: {
            include: {
              item: {
                select: {
                  ...variantAttributes,
                  supplier: select(['vendor', 'initials']),
                  inventory: select([
                    'id',
                    'particular',
                    'partsNumber',
                    'quantity'
                  ])
                }
              }
            }
          }
        }
      });

      res.success(salesReport);
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    const {
      // common
      salesStaff,
      soldItems,
      type,

      // sale
      bank,
      paymentType,

      // deleted/removed
      salesStaffX,
      removedItems,
      ...payload
    } = req.body;

    try {
      let updateItemQuery = {
        where: {
          id: req.query.id
        },
        data: {
          ...omit(payload, ['bankID']),
          type,
          salesStaff: {
            ...disconnectMultiple(salesStaffX),
            ...multiConnectOrCreateByName(salesStaff)
          },
          soldItems: {
            disconnect: safeType.array(removedItems).map(({ itemID }) => ({
              id: safeType.string(itemID)
            })),
            upsert: soldItems.map(({ itemID, variantID, quantity }) => ({
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
                    id: variantID
                  }
                }
              }
            }))
          }
        }
      };

      // NOTE: Restrict the user to only use type of Account | Sale and payment type of Cash | Cheque
      if (type === 'Account') {
        updateItemQuery.data = {
          ...updateItemQuery.data,
          siNumber: null,
          arsNumber: null,
          tin: null,
          chequeDate: null,
          chequeNumber: null,
          paymentType: null,
          bank: disconnectSingle(bank)
        };
      }

      if (type === 'Sale') {
        updateItemQuery.data = {
          ...updateItemQuery.data,
          paymentType,
          drNumber: null,
          crsNumber: null
        };
      }

      if (paymentType === 'Cash') {
        updateItemQuery.data = {
          ...updateItemQuery.data,
          chequeDate: null,
          chequeNumber: null,
          bank: disconnectSingle(bank)
        };
      }

      if (paymentType === 'Cheque') {
        updateItemQuery.data = {
          ...updateItemQuery.data,
          bank: connectOrCreate(safeType.object(bank)),
          amount: null
        };
      }

      const updateItem = prisma.salesReport.update(updateItemQuery);

      const updateItemsQuantity = soldItems.map(
        ({ inventoryID, quantity, prevQty }) =>
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
                  increment: quantity
                }
              }
            })
          )
        : [];

      await prisma.$transaction([
        updateItem,
        ...updateItemsQuantity,
        ...putBackRemovedItemsQuantity
      ]);

      res.success(updateItem);
    } catch (error) {
      res.error(error);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedItem = await prisma.salesReport.delete({
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
