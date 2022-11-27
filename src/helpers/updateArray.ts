import { AnimalProfileFragmentFragment, HerdFragmentFragment } from 'generated/graphql';

export type ObjectValue = AnimalProfileFragmentFragment | HerdFragmentFragment;
export type ReplaceFromArray = (
  currentArray: ObjectValue[],
  replacedValue: ObjectValue,
) => ObjectValue[];

export const replaceFromArray: ReplaceFromArray = (currentArray, replacedValue) => {
  const currentIndex = currentArray.findIndex(i => i.id === replacedValue.id);

  if (currentIndex < 0) return currentArray;

  const newArray = [...currentArray];

  newArray[currentIndex] = replacedValue;

  return newArray;
};

// like a replaceFromArray, but if currentIndex not found we write updatedValue to array
export const updateItemInArray: ReplaceFromArray = (currentArray, updatedValue) => {
  const currentIndex = currentArray.findIndex(i => i.id === updatedValue.id);

  if (currentIndex < 0) return [...currentArray, updatedValue];

  const newArray = [...currentArray];

  newArray[currentIndex] = updatedValue;

  return newArray;
};
