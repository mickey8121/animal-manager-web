import { FC, createContext } from 'react';

export interface DataContextValue {
  [key: string]: any;
}

export const DataContext = createContext<DataContextValue>({});

const DataProvider: FC<DataContextValue> = ({ children, value }) => {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
