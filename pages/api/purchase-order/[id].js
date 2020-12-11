import prisma from 'prisma-client';
import { select } from 'js/shapes/prisma-query';
import { variantAttributes } from 'js/shapes/variant';
import safety from 'js/utils/safety';
import api from 'js/utils/api';
import codeCalc from 'js/utils/codeCalc';

export default api({
  get: async (req, res) => {
    try {
      let po = await prisma.purchaseOrder.findOne({
        where: {
          id: req.query.id
        },
        include: {
          supplier: true,
          tracking: true,
          items: {
            include: {
              item: {
                select: {
                  ...variantAttributes,
                  supplier: select(['vendor', 'initials']),
                  inventory: select([
                    'id',
                    'particular',
                    'partsNumber',
                    'quantity'
                  ])
                }
              }
            }
          }
        }
      });

      const codes = await prisma.code.findMany({});

      po = {
        ...po,
        items: po.items.map((item) => ({
          ...item,
          item: {
            ...item.item,
            unitCost: codeCalc(codes, safety(item, 'item.codes', ''))
          }
        }))
      };

      res.success(po);
    } catch (error) {
      res.error(error);
    }
  }
});
