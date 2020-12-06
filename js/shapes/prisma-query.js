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

export const connectOrCreateByName = (payload) =>
  connectOrCreate(payload, 'name');

export const multiConnectOrCreate = (list = [], uniqueKey = 'id') => ({
  connectOrCreate: list.map((listItem) => ({
    where: {
      [uniqueKey]: listItem[uniqueKey]
    },
    create: listItem
  }))
});

export const multiConnectOrCreateByName = (payload) =>
  multiConnectOrCreate(payload, 'name');

/* ============================================================================
  CONNECT
 ============================================================================ */
export const connect = (item, uniqueKey = 'id') => ({
  connect: {
    [uniqueKey]: item[uniqueKey]
  }
});

export const connectByName = (item) => connect(item, 'name');

export const multiConnect = (items, uniqueKey = 'id') => ({
  connect: items.map((item) => ({
    [uniqueKey]: item[uniqueKey]
  }))
});

/* ============================================================================
  CREATE
 ============================================================================ */
export const create = (item) => ({
  create: item
});

export const multiCreate = (items) => ({
  create: items
});

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
