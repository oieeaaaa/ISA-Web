import prisma from 'prisma-client';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

export default (table = '', otherProps = {}) => async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const isOtherPropsEmpty = isObjectEmpty(otherProps);

    const items = await prisma[table].findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        dateCreated: 'desc'
      },
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
      }
    });

    res.success(items);
  } catch (error) {
    res.error(error);
  }
};
