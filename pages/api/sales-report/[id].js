import { PrismaClient } from '@prisma/client';
import { safeType } from 'js/utils/safety';
import api from 'js/utils/api';

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
    const { soldItems, removedItems, ...payload } = req.body;

    try {
      const updateItem = prisma.salesReport.update({
        where: {
          id: req.query.id
        },
        data: {
          ...payload,
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
      });

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
