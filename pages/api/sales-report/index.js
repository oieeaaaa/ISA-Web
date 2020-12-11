import prisma from 'prisma-client';
import api from 'js/utils/api';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';
import {
  multiCreate,
  multiConnectOrCreateByName,
  connect,
  connectOrCreateByName,
  select
} from 'js/shapes/prisma-query';

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

      const where = {
        AND: toFilterQuery(filters),
        OR: toFullTextSearchQuery(
          [
            'name',
            'type',
            'paymentType',
            'tin',
            'siNumber',
            'arsNumber',
            'drNumber',
            'crsNumber',
            'chequeNumber',
            'bank.name',
            'salesStaff.some.name',
            'address'
          ],
          search
        )
      };

      const query = {
        where,
        skip: (page - 1) * limit,
        orderBy: {
          [sortBy]: direction
        },
        take: limit,
        include: {
          salesStaff: true,
          bank: true,
          soldItems: select(['id', 'quantity'])
        }
      };

      let salesReports = await prisma.salesReport.findMany(query);

      salesReports = salesReports.map((salesReport) => ({
        ...salesReport,
        totalSoldItems: salesReport.soldItems.reduce(
          (totalQuantity, current) => (totalQuantity += current.quantity),
          0
        )
      }));

      const { count: totalItems } = await prisma.salesReport.aggregate({
        where,
        count: true
      });

      res.success({
        items: salesReports,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  },
  post: async (req, res) => {
    const { bank, salesStaff, soldItems, ...payload } = req.body;

    try {
      const createSalesReport = prisma.salesReport.create({
        data: {
          ...payload,
          bank: connectOrCreateByName(bank),
          salesStaff: multiConnectOrCreateByName(salesStaff),
          soldItems: multiCreate(
            soldItems.map(({ quantity, ...item }) => ({
              quantity,
              item: connect(item)
            }))
          )
        }
      });

      // outbound -> Reduce item quantities
      const decrementItemsQuantity = soldItems.map(
        ({ inventoryID, quantity }) =>
          prisma.inventory.update({
            where: { id: inventoryID },
            data: {
              quantity: {
                decrement: quantity
              }
            }
          })
      );

      const result = await prisma.$transaction([
        createSalesReport,
        ...decrementItemsQuantity
      ]);

      res.success(result[0]);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
