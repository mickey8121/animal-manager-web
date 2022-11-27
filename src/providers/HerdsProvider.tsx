import { FC, createContext } from 'react';

import useHerdsMain from 'hooks/herds/useHerdsMain';

import { Herd } from 'generated/graphql';

type Herds = Pick<Herd, 'id' | 'name' | '__typename'>[] | null;

interface ContextValue {
  herds?: Herds;
  loading?: boolean;
}

export const HerdsContext = createContext<ContextValue>({ herds: null, loading: false });

const HerdsProvider: FC = ({ children }) => {
  const { herds, loading } = useHerdsMain();

  return <HerdsContext.Provider value={{ herds, loading }}>{children}</HerdsContext.Provider>;
};

export default HerdsProvider;
