import isObjectEmpty from './isObjectEmpty';
import { safeType } from 'js/utils/safety';

export const connectOrCreateMultiple = (
  list,
  uniqueKey = 'name',
  connectKey = 'id'
) => {
  const newList = {};

  const forConnection = list
    .filter((item) => item[connectKey])
    .filter((item) => !item.isNew);

  const forCreation = list
    .filter((item) => item[uniqueKey])
    .filter((item) => item.isNew);

  if (forConnection.length) {
    newList.connect = forConnection.map((item) => ({
      [connectKey]: safeType.string(item[connectKey])
    }));
  }

  if (forCreation.length) {
    newList.create = forCreation.map(({ isNew, ...item }) => item); // eslint-disable-line
  }

  if (isObjectEmpty(newList)) return [];

  return newList;
};

export const connectOrCreateSingle = (item = {}, uniqueKey = 'name') => {
  if (!item) return null;

  const { isNew, ...newItem } = item;
  let payload = {};

  if (isNew) {
    payload = {
      create: newItem
    };
  } else {
    payload = {
      connect: {
        [uniqueKey]: safeType.string(newItem[uniqueKey])
      }
    };
  }

  return payload;
};

export default {
  connectOrCreateSingle,
  connectOrCreateMultiple
};
