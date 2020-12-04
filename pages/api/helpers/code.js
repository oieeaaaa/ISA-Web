import prisma from 'prisma-client';
import api from 'js/utils/api';
import { safeType } from 'js/utils/safety';

export default api({
  get: async (_, res) => {
    try {
      const data = await prisma.code.findMany({});

      res.success(data);
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    try {
      const { body: payload } = req;

      let transactions = [];
      const codes = await prisma.code.findMany({});

      // handle deleted codes
      const deletedCodes = codes.filter(
        (code) => !payload.some((item) => item.id === code.id)
      );

      if (deletedCodes.length) {
        transactions = transactions.concat(
          prisma.code.deleteMany({
            where: {
              OR: deletedCodes.map(({ id }) => ({ id }))
            }
          })
        );
      }

      transactions = transactions.concat(
        payload.map(({ id, ...item }) =>
          prisma.code.upsert({
            where: { id: safeType.string(id) },
            create: item,
            update: item
          })
        )
      );

      await prisma.$transaction(transactions);

      res.success();
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
