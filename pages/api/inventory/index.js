import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        search,
      } = req.query;

      const allItems = await prisma.inventory.findMany({
        skip: (page - 1) * limit,
        // TODO: Update this to full-text search
        where: {
          particular: {
            contains: search,
          },
        },
        take: limit,
        include: {
          brand: true,
          supplier: true,
          uom: true,
          applications: true,
        },
      });

      res.success(allItems);
    } catch (error) {
      console.log(error);
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
