import prisma from 'prisma-client';
import bcrypt from 'bcryptjs';
import api from 'js/utils/api';

export default api({
  put: async (req, res) => {
    const { id } = req.query;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
      if (newPassword !== confirmPassword)
        return res.error({
          message: 'Your confirm password should match your new password.'
        });

      const oldUser = await prisma.user.findOne({ where: { id } });

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        oldUser.password
      );

      if (!isOldPasswordMatch)
        return res.error({ message: 'Your old password is wrong.' });

      // Encrypt password
      const password = await bcrypt.hash(newPassword, 10);

      const result = await prisma.user.update({
        where: { id },
        data: {
          password
        }
      });

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
});
