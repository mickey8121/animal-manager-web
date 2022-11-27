interface Result {
  minRange: number;
  maxRange: number;
}

const getLabelsRanges = (visibleLabelsIndexes: number[]): Result => {
  return visibleLabelsIndexes
    .sort((a, b) => a - b)
    .reduce(
      (acc, item, i, arr) => {
        const difference = arr[i + 1] ? arr[i + 1] - item : 1;

        if (i === 0) acc.minRange = difference;

        if (acc.maxRange < difference) acc.maxRange = difference;

        if (acc.minRange > difference) acc.minRange = difference;

        return acc;
      },
      { minRange: 0, maxRange: 0 },
    );
};

export default getLabelsRanges;
