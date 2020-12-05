const removeDuplicates = (items, uniqueKey = 'id') =>
  items.filter((obj, index, arr) => {
    return (
      arr.map((mapObj) => mapObj[uniqueKey]).indexOf(obj[uniqueKey]) === index
    );
  });

export default removeDuplicates;
