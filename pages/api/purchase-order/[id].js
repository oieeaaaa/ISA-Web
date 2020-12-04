import prisma from 'prisma-client';
import api from 'js/utils/api';

export default api({
  get: async (req, res) => {
    try {
      const item = await prisma.purchaseOrder.findOne({
        where: {
          id: req.query.id
        },
        include: {
          supplier: true,
          items: {
            include: {
              item: {
                include: {
                  applications: true,
                  uom: true,
                  brand: true,
                  supplier: {
                    select: {
                      id: true,
                      initials: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      res.success(item);
    } catch (error) {
      res.error(error);
    }
  }
});
