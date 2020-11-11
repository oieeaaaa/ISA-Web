import { PrismaClient } from '@prisma/client';

/**
 * handle.
 *
 * @param {object} req
 * @param {object} res
 */
export default async function handle(req, res) {
  if (req.method !== 'POST') return;

  const prisma = new PrismaClient();

  try {
    const newItem = await prisma.inventory.create({
      data: req.body,
    });

    res.status(200).send(newItem);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
