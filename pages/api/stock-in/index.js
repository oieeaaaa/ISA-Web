import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import omit from 'lodash.omit';
import api from 'js/utils/api';
import {
  connect,
  connectOrCreateByName,
  multiConnectOrCreate
} from 'js/shapes/prisma-query';
import { stockInAttributes } from 'js/shapes/stock-in';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

const prisma = new PrismaClient();

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

      const items = await prisma.stockIn.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: direction
        },
        select: {
          ...omit(stockInAttributes, ['items', 'remarks']),
          supplierID: false,
          supplier: {
            select: {
              initials: true,
              vendor: true
            }
          }
        },
        where: {
          AND: toFilterQuery(filters),
          OR: [
            {
              supplier: {
                OR: [
                  {
                    initials: {
                      contains: search
                    }
                  },
                  {
                    vendor: {
                      contains: search
                    }
                  }
                ]
              }
            },
            ...toFullTextSearchQuery(
              [
                'referenceNumber',
                'remarks',
                'receivedBy',
                'checkedBy',
                'codedBy'
              ],
              search
            )
          ]
        }
      });

      const totalItems = await prisma.stockIn.count();

      res.success({
        items,
        totalItems
      });
    } catch (error) {
      res.error(error);
    }
  },

  // TODO: Handle Validation
  post: async (req, res) => {
    const { items, supplier, ...stockIn } = req.body;

    try {
      // making sure that each inventory have an id
      const newItems = items.map(({ inventory, ...item }) => {
        if (!inventory.id) {
          inventory = {
            ...inventory,
            id: v4() // new inventory id, so we can relate this when creating the stockIn
          };
        }

        return {
          ...item,
          inventory
        };
      });

      const upsertInventoryItems = newItems.map(
        ({ size, brand, inventory }) => {
          const { uom, applications, quantity, ...rest } = inventory;

          const data = {
            ...rest,
            quantity: { increment: quantity },
            uom: connectOrCreateByName(uom),
            suppliers: connect(supplier),
            sizes: connectOrCreateByName(size),
            brands: connectOrCreateByName(brand),
            applications: multiConnectOrCreate(applications, 'name')
          };

          return prisma.inventory.upsert({
            where: {
              id: inventory.id
            },
            create: {
              ...data,
              quantity
            },
            update: data
          });
        }
      );

      // upsert the items first
      await prisma.$transaction(upsertInventoryItems);

      // then create the stockIn
      await prisma.stockIn.create({
        // StockIn
        data: {
          ...stockIn,
          supplier: connect(supplier),

          // StockItems (many)
          items: {
            create: newItems.map(({ size, brand, inventory }) => {
              const { applications, uom, ...restOfInventory } = inventory;

              return {
                inventory: {
                  connectOrCreate: {
                    where: {
                      id: inventory.id
                    },
                    create: {
                      ...restOfInventory,
                      uom: connectOrCreateByName(uom),
                      suppliers: connect(supplier),
                      sizes: connectOrCreateByName(size),
                      brands: connectOrCreateByName(brand),
                      applications: multiConnectOrCreate(applications, 'name')
                    }
                  }
                },
                supplier: connect(supplier),
                size: connect(size, 'name'),
                brand: connect(brand, 'name')
              };
            })
          }
        }
      });

      res.success();
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
