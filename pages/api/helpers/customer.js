import prisma from 'prisma-client';
import api from 'js/utils/api';
import removeDuplicates from 'js/utils/removeDuplicates';

export default api({
  get: async (req, res) => {
    try {
      const { search, direction = 'desc' } = req.query;

      const data = await prisma.salesReport.findMany({
        take: 5,
        orderBy: { name: direction },
        select: {
          name: true
        },
        where: {
          name: {
            contains: search
          }
        }
      });

      res.success(removeDuplicates(data, 'name'));
    } catch (error) {
      res.error(error);
    }
  }
});
