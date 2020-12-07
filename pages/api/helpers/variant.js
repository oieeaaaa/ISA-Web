import prisma from 'prisma-client';
import { select, selectSingle } from 'js/shapes/prisma-query';
import api from 'js/utils/api';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

export default api({
  get: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 5,
        search = '',
        sortBy = 'dateCreated',
        direction = 'desc',
        ...filters
      } = req.query;

      const where = {
        OR: toFullTextSearchQuery(
          [
            'name',
            'brand.name',
            'size.name',
            'inventory.OR[0].particular',
            'inventory.OR[1].partsNumber',
            'supplier.OR[0].initials',
            'supplier.OR[1].vendor'
          ],
          search
        ),
        AND: toFilterQuery(filters)
      };

      const items = await prisma.variant.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: direction
        },
        select: {
          id: true,
          name: true,
          dateCreated: true,
          inventory: select([
            'particular',
            'partsNumber',
            'quantity',
            'codes',
            'uom'
          ]),
          supplier: select(['initials', 'vendor']),
          size: selectSingle('name'),
          brand: selectSingle('name')
        }
      });

      const { count: totalItems } = await prisma.variant.aggregate({
        where,
        count: true
      });

      res.success({
        items,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  }
});
