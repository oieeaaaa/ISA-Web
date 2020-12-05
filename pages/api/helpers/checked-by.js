import prisma from 'prisma-client';
import api from 'js/utils/api';
import removeDuplicates from 'js/utils/removeDuplicates';

export default api({
  get: async (req, res) => {
    try {
      const { search, direction = 'desc' } = req.query;

      const data = await prisma.stockIn.findMany({
        take: 5,
        orderBy: { checkedBy: direction },
        select: {
          checkedBy: true
        },
        where: {
          checkedBy: {
            contains: search
          }
        }
      });

      res.success(removeDuplicates(data, 'checkedBy'));
    } catch (error) {
      res.error(error);
    }
  }
});
