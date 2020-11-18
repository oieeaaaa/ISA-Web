import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default (table = '', otherProps = {}) => async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;

    const items = await prisma[table].findMany({
      select: {
        name: true,
        ...otherProps,
      },
      where: {
        name: {
          contains: search,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.success(items);
  } catch (error) {
    console.log(error);
    res.error(error);
  }
};
