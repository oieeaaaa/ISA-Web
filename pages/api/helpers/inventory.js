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
        sortBy = 'particular',
        direction = 'desc',
        ...filters
      } = req.query;

      const query = {
        skip: (page - 1) * limit,
        orderBy: {
          [sortBy]: direction
        },
        where: {
          AND: toFilterQuery(filters),
          OR: toFullTextSearchQuery(
            [
              'particular',
              'referenceNumber',
              'partsNumber',
              'description',
              'remarks',
              'receivedBy',
              'checkedBy',
              'codedBy'
            ],
            search
          )
        },
        take: limit,
        include: {
          brand: true,
          supplier: true,
          uom: true,
          applications: true
        }
      };

      const data = await prisma.inventory.findMany(query);

      res.success(data);
    } catch (error) {
      res.error(error);
    }
  }
});
