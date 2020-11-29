import { PrismaClient } from '@prisma/client';
import api from 'js/utils/api';
import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

const prisma = new PrismaClient();

export default api({
  get: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        search,
        sortBy = 'particular',
        direction = 'desc',
        ...filters
      } = req.query;

      const query = {
        skip: (page - 1) * limit,
        orderBy: {
          [sortBy]: direction
        },
        where: {
          AND: toFilterQuery(filters),
          OR: toFullTextSearchQuery(
            [
              'particular',
              'referenceNumber',
              'partsNumber',
              'description',
              'remarks',
              'receivedBy',
              'checkedBy',
              'codedBy'
            ],
            search
          )
        },
        take: limit,
        include: {
          brand: true,
          supplier: true,
          uom: true,
          applications: true
        }
      };

      const items = await prisma.inventory.findMany(query);
      const totalItems = await prisma.inventory.count();

      res.success({
        items,
        totalItems
      });
    } catch (error) {
      console.log(error);
      res.error(error);
    }
  },
  post: async (req, res) => {
    const { applications, uom, brand, supplier, ...payload } = req.body;

    try {
      const newItem = await prisma.inventory.create({
        data: {
          ...payload,
          applications: connectOrCreateMultiple(applications),
          brand: connectOrCreateSingle(brand),
          uom: connectOrCreateSingle(uom),
          supplier: {
            connect: {
              id: supplier.id
            }
          }
        }
      });
      res.success(newItem);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
