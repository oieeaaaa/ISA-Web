import { PrismaClient } from '@prisma/client';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

const prisma = new PrismaClient();

export default (table = '', otherProps = {}) => async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const isOtherPropsEmpty = isObjectEmpty(otherProps);

    const items = await prisma[table].findMany({
      select: isOtherPropsEmpty
        ? {
            id: true,
            name: true
          }
        : {
            id: true,
            ...otherProps
          },
      where: {
        OR: isOtherPropsEmpty
          ? toFullTextSearchQuery(['name'], search)
          : toFullTextSearchQuery(Object.keys(otherProps), search)
      },
      skip: (page - 1) * limit,
      take: limit
    });

    res.success(items);
  } catch (error) {
    res.error(error);
  }
};
