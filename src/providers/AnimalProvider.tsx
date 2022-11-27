import { FC, createContext } from 'react';

import { Maybe, Animal } from 'generated/graphql';

export interface AnimalContextValue {
  animal?: Maybe<Animal>;
  loading?: boolean;
}

export const AnimalContext = createContext<AnimalContextValue>({
  animal: null,
  loading: false,
});

const AnimalProvider: FC<AnimalContextValue> = ({ children, ...value }) => {
  return <AnimalContext.Provider value={value}>{children}</AnimalContext.Provider>;
};

export default AnimalProvider;
