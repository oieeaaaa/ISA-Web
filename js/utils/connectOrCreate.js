import isObjectEmpty from './isObjectEmpty';

export const connectOrCreateMultiple = (list, uniqueKey = 'name') => {
  const newList = {};

  const forConnection = list
    .filter((item) => item[uniqueKey])
    .filter((item) => !item.isNew);

  const forCreation = list
    .filter((item) => item[uniqueKey])
    .filter((item) => item.isNew);

  if (forConnection.length) {
    newList.connect = forConnection.map((item) => ({
      [uniqueKey]: item[uniqueKey]
    }));
  }

  if (forCreation.length) {
    newList.create = forCreation.map(({ isNew, ...item }) => item); // eslint-disable-line
  }

  if (isObjectEmpty(newList)) return [];

  return newList;
};

export const connectOrCreateSingle = (item = {}, uniqueKey = 'name') => {
  const { isNew, ...newItem } = item;
  let payload = {};

  if (isNew) {
    payload = {
      create: newItem
    };
  } else {
    payload = {
      connect: {
        [uniqueKey]: newItem[uniqueKey]
      }
    };
  }

  return payload;
};

export default {
  connectOrCreateSingle,
  connectOrCreateMultiple
};
