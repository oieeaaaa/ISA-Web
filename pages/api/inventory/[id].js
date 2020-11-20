import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const item = await prisma.inventory.findOne({
        where: {
          id: req.query.id
        },
        include: {
          supplier: true,
          applications: true,
          brand: true,
          uom: true,
          codes: true
        }
      });

      res.success(item);
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    try {
      const updatedItem = await prisma.inventory.update({
        where: {
          id: req.query.id
        },
        data: req.body
      });

      res.success(updatedItem);
    } catch (error) {
      res.error(error);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedItem = await prisma.inventory.delete({
        where: {
          id: req.query.id
        }
      });

      res.success(deletedItem);
    } catch (error) {
      console.log(error);
      res.error(error);
    }
  }
});
