import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import api from 'js/utils/api';

const addItem = async (req, res) => {
  const prisma = new PrismaClient();

  try {
    const newItem = await prisma.inventory.create({
      data: {
        id: v4(),
        ...req.body,
      },
    });

    res.status(200).send(newItem);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export default api({ post: addItem });
