import { PrismaClient } from '@prisma/client';
import safety, { safeType } from 'js/utils/safety';
import api from 'js/utils/api';
import omit from 'lodash.omit';
import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';
import { disconnectSingle } from 'js/utils/disconnect';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const item = await prisma.salesReport.findOne({
        where: {
          id: req.query.id
        },
        include: {
          salesStaff: true,
          paymentType: true,
          bank: true,
          type: true,
          soldItems: {
            include: {
              item: {
                include: {
                  applications: true,
                  uom: true,
                  brand: true,
                  supplier: {
                    select: {
                      id: true,
                      initials: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.success(item);
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    const {
      type,
      paymentType,
      bank,
      salesStaff,
      soldItems,
      removedItems,
      ...payload
    } = req.body;

    console.log({
      type,
      bank,
      salesStaff,
      paymentType,
      removedItems,
      soldItems
    });

    let updateItemQuery = {
      where: {
        id: req.query.id
      },
      data: {
        ...omit(payload, ['typeID', 'paymentTypeID', 'bankID']),
        type: connectOrCreateSingle(type),
        paymentType: connectOrCreateSingle(safeType.object(paymentType)),
        bank: connectOrCreateSingle(safeType.object(bank)),
        salesStaff: connectOrCreateMultiple(salesStaff),
        soldItems: {
          disconnect: removedItems.map(({ id }) => ({
            id: safeType.string(id)
          })),
          upsert: soldItems.map(({ soldItemID, id, selectedQuantity }) => ({
            where: {
              id: safeType.string(soldItemID)
            },
            update: {
              quantity: selectedQuantity
            },
            create: {
              quantity: selectedQuantity,
              item: {
                connect: {
                  id
                }
              }
            }
          }))
        }
      }
    };

    // TODO: Find a way to restrict the user to only use type of Account | Sale and payment type of Cash | Cheque
    if (type.name.toLowerCase() === 'account') {
      updateItemQuery.data = {
        ...updateItemQuery.data,
        siNumber: null,
        crsNumber: null,
        tin: null,
        chequeDate: null,
        chequeNumber: null,
        paymentType: disconnectSingle(paymentType),
        bank: disconnectSingle(bank)
      };
    }

    if (type.name.toLowerCase() === 'sale') {
      updateItemQuery.data = {
        ...updateItemQuery.data,
        drNumber: null,
        crsNumber: null
      };
    }

    if (safety(paymentType, 'name', '').toLowerCase() === 'cash') {
      updateItemQuery.data = {
        ...updateItemQuery.data,
        chequeDate: null,
        chequeNumber: null,
        bank: disconnectSingle(bank)
      };
    }

    if (safety(paymentType, 'name', '').toLowerCase() === 'cheque') {
      updateItemQuery.data = {
        ...updateItemQuery.data,
        amount: null
      };
    }

    try {
      const updateItem = prisma.salesReport.update(updateItemQuery);

      const updateItemsQuantity = soldItems.map(
        ({ id, selectedQuantity, prevQty }) =>
          prisma.inventory.update({
            where: { id },
            data: {
              quantity: {
                decrement: selectedQuantity - safeType.number(prevQty)
              }
            }
          })
      );

      const putBackRemovedItemsQuantity = removedItems.length
        ? removedItems.map((ri) =>
            prisma.inventory.update({
              where: { id: ri.itemID },
              data: {
                quantity: {
                  increment: ri.quantity
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
