interface Indexes {
  [key: string]: (number | string)[];
}

const getVisibleLabelsIndexes = (chartLabels: string[]): number[] => {
  let result: number[] = [];

  const indexes = chartLabels.reduce((acc: Indexes, label, i, arr) => {
    if (acc[label]) {
      acc[label] = [...acc[label], i];
    } else {
      acc[label] = [i];
    }

    if (arr[i + 1] !== label) acc[label] = [...acc[label], ''];

    return acc;
  }, {});

  for (const key in indexes) {
    let index = 0;
    let count = 0;

    const array = indexes[key].reduce((acc: (number | never)[], item, i, arr) => {
      if (typeof item === 'number') {
        index += item;
        count++;
      }

      if (typeof arr[i + 1] !== 'number') {
        const midIndex = item === 0 ? 0 : Math.round(index / count);

        if (midIndex || midIndex === 0) acc = [...acc, midIndex];

        index = 0;
        count = 0;
      }

      return acc;
    }, []);

    result = [...result, ...array];
  }

  return result;
};

export default getVisibleLabelsIndexes;
