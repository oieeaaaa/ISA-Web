import prisma from 'prisma-client';
import api from 'js/utils/api';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';
import toFilterQuery from 'js/utils/toFilterQuery';

// TODO: Analyze if this a duplicate or not.
export default api({
  get: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        search,
        sortBy = 'dateCreated',
        direction = 'desc',
        ...filters
      } = req.query;

      const query = {
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: direction
        },
        where: {
          OR: toFullTextSearchQuery(
            ['particular', 'partsNumber', 'description'],
            search
          ),
          AND: toFilterQuery(filters)
        },
        select: {
          id: true,
          particular: true,
          partsNumber: true,
          quantity: true
        }
      };

      const result = await prisma.inventory.findMany(query);

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
});
