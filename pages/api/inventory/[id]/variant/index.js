import prisma from 'prisma-client';
import {
  connect,
  create,
  connectOrCreateByName,
  connectByName
} from 'js/shapes/prisma-query';
import api from 'js/utils/api';

export default api({
  // TODO: handle validation
  post: async (req, res) => {
    const { id } = req.query;
    const { quantity = 0, supplier, size, brand, ...variant } = req.body;

    try {
      const result = await prisma.inventory.update({
        where: {
          id
        },
        data: {
          quantity: {
            increment: Number(quantity)
          },
          suppliers: connect(supplier),
          brands: connectOrCreateByName(brand),
          sizes: connectOrCreateByName(size),
          variants: create({
            ...variant,
            supplier: connect(supplier),
            size: connectByName(size),
            brand: connectByName(brand)
          })
        },
        include: {
          variants: {
            take: 1,
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
  }
});
