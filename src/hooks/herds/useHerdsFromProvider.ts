import { useContext } from 'react';

import { HerdsContext } from 'providers/HerdsProvider';

import { Herd } from 'generated/graphql';

type Herds = Pick<Herd, 'id' | 'name' | '__typename'>[] | null;

type HerdsFromProvider = Herds;

interface ContextValue<T> {
  herds?: T;
  loading?: boolean;
}

const useHerdsFromProvider = (): ContextValue<HerdsFromProvider> => useContext(HerdsContext);

export default useHerdsFromProvider;
