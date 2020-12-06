/* ============================================================================
  CONNECT OR CREATE
 ============================================================================ */
export const connectOrCreate = (payload = {}, uniqueKey = 'id') => ({
  connectOrCreate: {
    where: {
      [uniqueKey]: payload[uniqueKey]
    },
    create: payload
  }
});

export const multiConnectOrCreate = (list = [], uniqueKey = 'id') => ({
  connectOrCreate: list.map((listItem) => ({
    where: {
      [uniqueKey]: listItem[uniqueKey]
    },
    create: listItem
  }))
});

export const connect = (item, uniqueKey = 'id') => ({
  connect: {
    [uniqueKey]: item[uniqueKey]
  }
});

export const connectOrCreateByName = (payload) =>
  connectOrCreate(payload, 'name');

/* ============================================================================
  SELECT
 ============================================================================ */
export const select = (attributes) => ({
  select: attributes.reduce(
    (selected, attribute) => ({ ...selected, [attribute]: true }),
    {}
  )
});

export const selectSingle = (attribute) => ({
  select: { [attribute]: true }
});
