import { PrismaClient } from '@prisma/client';
import omit from 'lodash.omit';
import api from 'js/utils/api';
import { safeType } from 'js/utils/safety';
import {
  connectOrCreateMultiple,
  connectOrCreateSingle
} from 'js/utils/connectOrCreate';

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
          uom: true
        }
      });

      res.success(item);
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    const {
      applications,
      applicationsX,
      uom,
      brand,
      supplier,
      ...payload
    } = req.body;

    try {
      const updatedItem = await prisma.inventory.update({
        where: {
          id: req.query.id
        },
        data: {
          ...omit(payload, ['uomID', 'supplierID', 'brandID', 'codeId']),
          applications: {
            disconnect: safeType.array(applicationsX).map(({ id }) => ({ id })),
            ...connectOrCreateMultiple(applications)
          },
          brand: connectOrCreateSingle(brand),
          uom: connectOrCreateSingle(uom),
          supplier: {
            connect: {
              id: supplier.id
            }
          }
        }
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
