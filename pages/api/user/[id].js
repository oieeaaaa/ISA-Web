import prisma from 'prisma-client';
import api from 'js/utils/api';

export default api({
  get: async (req, res) => {
    try {
      const { id } = req.query;

      const user = await prisma.user.findOne({
        where: { id },
        select: {
          id: true,
          displayName: true,
          username: true
        }
      });

      res.success(user);
    } catch (error) {
      res.error(error);
    }
  },
  put: async (req, res) => {
    const { id } = req.query;

    try {
      const result = await prisma.user.update({
        where: { id },
        data: req.body
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
});
