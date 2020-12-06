import prisma from 'prisma-client';
import { selectSingle, select } from 'js/shapes/prisma-query';
import { inventoryAttributes } from 'js/shapes/inventory';
import { variantAttributes } from 'js/shapes/variant';
import api from 'js/utils/api';

export default api({
  get: async (req, res) => {
    try {
      const { id } = req.query;

      const result = await prisma.inventory.findOne({
        where: { id },
        select: {
          ...inventoryAttributes,
          uom: selectSingle('name'),
          variants: {
            select: {
              ...variantAttributes,
              brand: selectSingle('name'),
              size: selectSingle('name'),
              supplier: select(['vendor', 'initials'])
            }
          },
          applications: selectSingle('name'),
          brands: selectSingle('name'),
          sizes: selectSingle('name'),
          suppliers: select(['vendor', 'initials'])
        }
      });

      res.success(result);
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
      res.error(error);
    }
  }
});
