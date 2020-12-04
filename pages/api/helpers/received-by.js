import prisma from 'prisma-client';
import api from 'js/utils/api';

export default api({
  get: async (req, res) => {
    try {
      const { search, direction = 'desc' } = req.query;

      const data = await prisma.stockIn.findMany({
        take: 5,
        orderBy: { receivedBy: direction },
        select: {
          receivedBy: true
        },
        where: {
          receivedBy: {
            contains: search
          }
        }
      });

      res.success(data);
    } catch (error) {
      res.error(error);
    }
  }
});
