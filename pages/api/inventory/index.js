import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const { page = 1, limit = 5 } = req.query;

      const allItems = await prisma.inventory.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          supplier: true,
          applications: true,
          brand: true,
          uom: true,
          codes: true,
        },
      });

      res.success(allItems);
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    try {
      const newItem = await prisma.inventory.create({ data: req.body });
      res.success(newItem);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  },
});
