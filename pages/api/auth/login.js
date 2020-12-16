import prisma from 'prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import api from 'js/utils/api';

const KEY = process.env.SECRET_KEY;

export default api({
  post: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res.error({ message: 'Missing username or password' });

    try {
      const user = await prisma.user.findOne({
        where: { username }
      });

      if (!user) return res.error({ message: 'User not found!' });

      const { id, dateCreated, password: hashedPassword } = user;

      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch) return res.error({ message: 'Invalid password!' });

      jwt.sign(
        { id, username, dateCreated },
        KEY,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (_, token) => {
          /* Send succes with token */
          res.success({
            user: {
              id,
              dateCreated,
              username: user.username,
              displayName: user.displayName
            },
            token: 'Bearer ' + token
          });
        }
      );
    } catch (error) {
      res.error(error);
    }
  }
});
