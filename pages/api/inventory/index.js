import prisma from 'prisma-client';
import {
  connect,
  multiConnect,
  connectOrCreateByName,
  multiConnectOrCreateByName,
  connectByName,
  selectSingle,
  select,
  multiCreate
} from 'js/shapes/prisma-query';
import { inventoryAttributes } from 'js/shapes/inventory';
import api from 'js/utils/api';
import toFilterQuery from 'js/utils/toFilterQuery';
import toFullTextSearchQuery from 'js/utils/toFullTextSearchQuery';

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

      const query = {
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: direction
        },
        where: {
          OR: toFullTextSearchQuery(
            ['particular', 'partsNumber', 'description'],
            search
          ),
          AND: toFilterQuery(filters)
        },
        select: {
          ...inventoryAttributes,
          uom: selectSingle('name'),
          variants: selectSingle('name'),
          applications: selectSingle('name'),
          brands: selectSingle('name'),
          sizes: selectSingle('name'),
          suppliers: select(['vendor', 'initials'])
        }
      };

      const result = await prisma.inventory.findMany(query);

      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  // TODO: handle validation
  post: async (req, res) => {
    const { uom, applications, variants, ...inventory } = req.body;

    try {
      // aggregate variants attributes, for the creation of inventory
      const suppliers = variants.map(({ supplier }) => supplier);
      const brands = variants.map(({ brand }) => brand);
      const sizes = variants.map(({ size }) => size);

      // connect or create variant relationships
      const newVariants = variants.map(
        ({ supplier, brand, size, ...variant }) => ({
          ...variant,
          supplier: connect(supplier),
          size: connectByName(size),
          brand: connectByName(brand)
        })
      );

      // create inventory w/ aggregated attributes & "querified" variants
      const result = await prisma.inventory.create({
        data: {
          ...inventory,
          uom: connectOrCreateByName(uom),
          suppliers: multiConnect(suppliers),
          brands: multiConnectOrCreateByName(brands),
          sizes: multiConnectOrCreateByName(sizes),
          applications: multiConnectOrCreateByName(applications),
          variants: multiCreate(newVariants)
        }
      });

      res.success(result);
    } catch (error) {
      console.error(error);
      res.error(error);
    }
  }
});
