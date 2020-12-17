import prisma from 'prisma-client';
import {
  selectSingle,
  select,
  connectOrCreateByName,
  multiConnectOrCreateByName
} from 'js/shapes/prisma-query';
import { inventoryAttributes } from 'js/shapes/inventory';
import { variantAttributes } from 'js/shapes/variant';
import api from 'js/utils/api';
import codeCalc from 'js/utils/codeCalc';
import { disconnectMultiple } from 'js/utils/disconnect';

export default api({
  get: async (req, res) => {
    try {
      const { id } = req.query;

      const codes = await prisma.code.findMany({});

      let { variants, ...item } = await prisma.inventory.findOne({
        where: { id },
        select: {
          ...inventoryAttributes,
          uom: true,
          variants: {
            select: {
              ...variantAttributes,
              brand: true,
              size: true,
              supplier: select(['vendor', 'initials'])
            }
          },
          applications: true,
          brands: true,
          sizes: true,
          suppliers: select(['vendor', 'initials'])
        }
      });

      variants = variants.map((variant) => ({
        ...variant,
        unitCost: codeCalc(codes, variant.codes)
      }));

      res.success({
        ...item,
        variants
      });
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    const { id } = req.query;
    const {
      quantity,
      uom,
      applications,
      applicationsX,
      ...inventory
    } = req.body;

    try {
      const result = await prisma.inventory.update({
        where: { id },
        data: {
          ...inventory,
          quantity: Number(quantity),
          uom: connectOrCreateByName(uom),
          applications: {
            ...disconnectMultiple(applicationsX),
            ...multiConnectOrCreateByName(applications)
          }
        },
        include: {
          variants: {
            take: 5,
            orderBy: {
              dateCreated: 'desc'
            }
          }
        }
      });

      res.success(result);
    } catch (error) {
      console.error(error);
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
      res.error(error);
    }
  }
});
