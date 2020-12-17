import prisma from 'prisma-client';
import {
  connect,
  connectByName,
  select,
  selectSingle
} from 'js/shapes/prisma-query';
import { variantAttributes } from 'js/shapes/variant';
import api from 'js/utils/api';
import codeCalc from 'js/utils/codeCalc';

export default api({
  put: async (req, res) => {
    const { variantID } = req.query;
    const { supplier, brand, size, ...variant } = req.body;

    try {
      const codes = await prisma.code.findMany({});

      const result = await prisma.variant.update({
        where: {
          id: variantID
        },
        data: {
          ...variant,
          supplier: connect(supplier),
          size: connectByName(size),
          brand: connectByName(brand)
        },
        select: {
          ...variantAttributes,
          brand: selectSingle('name'),
          size: selectSingle('name'),
          supplier: select(['vendor', 'initials'])
        }
      });

      res.success({
        ...result,
        unitCost: codeCalc(codes, variant.codes)
      });
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
