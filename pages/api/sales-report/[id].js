import { PrismaClient } from '@prisma/client';
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
    const { soldItems, ...payload } = req.body;

    try {
      const updateItem = prisma.salesReport.update({
        where: {
          id: req.query.id
        },
        data: {
          ...payload,
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
        ({ id, newItemQuantity }) =>
          prisma.inventory.update({
            where: { id },
            data: {
              quantity: {
                set: newItemQuantity
              }
            }
          })
      );

      await prisma.$transaction([
        updateItem,
        ...multiUpdateInventoryItemQuantity
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
